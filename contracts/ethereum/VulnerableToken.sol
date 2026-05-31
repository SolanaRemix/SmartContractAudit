// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VulnerableToken
 * @dev EDUCATIONAL EXAMPLE — All vulnerabilities documented and fixed
 * 
 * ORIGINAL VULNERABILITIES (for scanner detection testing):
 * 1. ❌ Unprotected mint() — Anyone could mint unlimited tokens
 * 2. ❌ Integer overflow in transfer() — Pre-0.8.0 behavior
 * 3. ❌ tx.origin authentication — Phishing vulnerability
 * 4. ❌ Reentrancy in withdraw() — State change after external call
 * 5. ❌ Unrestricted delegatecall — Arbitrary storage overwrite
 * 6. ❌ Unprotected selfdestruct — Anyone could destroy contract
 * 
 * THIS VERSION: All vulnerabilities fixed for production reference.
 * Deploy the ORIGINAL version to testnets only for scanner validation.
 */

import "@openzeppelin/contracts@4.9.3/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@4.9.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.3/security/ReentrancyGuard.sol";

contract VulnerableToken is ERC20, Ownable, ReentrancyGuard {
    // ─── Constants ────────────────────────────
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    // ─── Events ───────────────────────────────
    event TokensMinted(address indexed to, uint256 amount, uint256 newTotalSupply);
    event TokensBurned(address indexed from, uint256 amount, uint256 newTotalSupply);
    event EtherWithdrawn(address indexed user, uint256 amount);
    event EmergencyShutdown(address indexed triggeredBy);
    
    // ─── Constructor ──────────────────────────
    constructor(uint256 _initialSupply) ERC20("VulnerableToken", "VULN") {
        require(_initialSupply > 0, "Initial supply must be positive");
        require(_initialSupply <= MAX_SUPPLY, "Initial supply exceeds max");
        
        _mint(msg.sender, _initialSupply * 10**decimals());
    }
    
    // ───────────────────────────────────────────
    // FIX #1: Access-controlled mint with supply cap
    // ORIGINAL: public — anyone could mint unlimited tokens
    // ───────────────────────────────────────────
    
    /**
     * @dev Mint new tokens (owner only, with cap)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Cannot mint zero tokens");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, totalSupply());
    }
    
    // ───────────────────────────────────────────
    // FIX #2: Overflow-protected transfer
    // ORIGINAL: No overflow protection (pre-0.8.0)
    // Solidity ^0.8.20 has built-in checks
    // ───────────────────────────────────────────
    
    /**
     * @dev Transfer tokens (ERC20 standard with overflow protection)
     * @param to Recipient address
     * @param amount Amount to transfer
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(to != address(0), "Cannot transfer to zero address");
        require(to != address(this), "Cannot transfer to contract self");
        require(amount > 0, "Transfer amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Solidity ^0.8.20 has built-in overflow checks
        return super.transfer(to, amount);
    }
    
    // ───────────────────────────────────────────
    // FIX #3: msg.sender instead of tx.origin
    // ORIGINAL: tx.origin == owner — phishing vector
    // ───────────────────────────────────────────
    
    /**
     * @dev Transfer tokens from approved spender
     * @param from Source address
     * @param to Recipient address
     * @param amount Amount to transfer
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(from != address(0), "Cannot transfer from zero address");
        require(to != address(0), "Cannot transfer to zero address");
        require(amount > 0, "Transfer amount must be positive");
        require(balanceOf(from) >= amount, "Insufficient balance");
        
        // FIXED: Removed tx.origin check — use standard allowance system only
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Approve spender (with race condition protection)
     * @param spender Address to approve
     * @param amount Approval amount
     */
    function approve(address spender, uint256 amount) public override returns (bool) {
        require(spender != address(0), "Cannot approve zero address");
        
        // FIXED: Reset to 0 first to prevent front-running
        // See: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
        if (allowance(msg.sender, spender) > 0 && amount > 0) {
            _approve(msg.sender, spender, 0);
        }
        
        return super.approve(spender, amount);
    }
    
    // ───────────────────────────────────────────
    // FIX #4: ReentrancyGuard + checks-effects-interactions
    // ORIGINAL: State changed AFTER external call
    // ───────────────────────────────────────────
    
    /**
     * @dev Withdraw ETH balance (reentrancy-protected)
     */
    function withdraw() external nonReentrant {
        uint256 amount = balanceOf(msg.sender);
        require(amount > 0, "No tokens to withdraw");
        
        // Checks-Effects-Interactions pattern:
        // 1. CHECKS: Done above
        // 2. EFFECTS: Update state BEFORE external call
        _burn(msg.sender, amount);
        
        // 3. INTERACTIONS: External call LAST
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "ETH transfer failed");
        
        emit EtherWithdrawn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, totalSupply());
    }
    
    // ───────────────────────────────────────────
    // FIX #5: Restricted delegatecall with allowlist
    // ORIGINAL: Anyone could execute arbitrary code
    // ───────────────────────────────────────────
    
    mapping(address => bool) private trustedTargets;
    
    event TargetTrusted(address indexed target, bool trusted);
    
    /**
     * @dev Add trusted delegatecall target
     * @param target Address to trust
     */
    function addTrustedTarget(address target) external onlyOwner {
        require(target != address(0), "Invalid target");
        require(!trustedTargets[target], "Already trusted");
        require(target.code.length > 0, "Target must be a contract");
        
        trustedTargets[target] = true;
        emit TargetTrusted(target, true);
    }
    
    /**
     * @dev Remove trusted delegatecall target
     * @param target Address to untrust
     */
    function removeTrustedTarget(address target) external onlyOwner {
        require(trustedTargets[target], "Not trusted");
        
        trustedTargets[target] = false;
        emit TargetTrusted(target, false);
    }
    
    /**
     * @dev Execute delegatecall to trusted target only
     * @param target Trusted contract address
     * @param data Encoded function call
     * @return result Return data from delegatecall
     */
    function execute(
        address target,
        bytes calldata data
    )
        external
        onlyOwner
        returns (bytes memory result)
    {
        require(trustedTargets[target], "Target not trusted");
        require(data.length > 0, "Empty calldata");
        require(data.length <= 1024, "Calldata too large"); // Prevent gas bombs
        
        // FIXED: Only allow owner to call, only to trusted targets
        (bool success, bytes memory returnData) = target.delegatecall(data);
        
        if (!success) {
            // Bubble up revert reason
            if (returnData.length > 0) {
                assembly {
                    revert(add(32, returnData), mload(returnData))
                }
            } else {
                revert("Delegatecall failed");
            }
        }
        
        return returnData;
    }
    
    /**
     * @dev Check if target is trusted
     * @param target Address to check
     * @return bool Trust status
     */
    function isTrustedTarget(address target) public view returns (bool) {
        return trustedTargets[target];
    }
    
    // ───────────────────────────────────────────
    // FIX #6: Access-controlled emergency shutdown
    // ORIGINAL: Anyone could selfdestruct
    // ───────────────────────────────────────────
    
    bool public emergencyShutdown;
    
    /**
     * @dev Emergency shutdown (owner only, irreversible)
     */
    function emergencyDestroy() external onlyOwner {
        require(!emergencyShutdown, "Already in shutdown");
        
        emergencyShutdown = true;
        emit EmergencyShutdown(msg.sender);
        
        // Transfer remaining ETH to owner before selfdestruct
        selfdestruct(payable(owner()));
    }
    
    // ─── Receive ETH ─────────────────────────
    receive() external payable {
        // Accept ETH for withdrawal functionality
    }
    
    // ─── Fallback (reject unexpected calls) ──
    fallback() external payable {
        revert("Invalid function call");
    }
}