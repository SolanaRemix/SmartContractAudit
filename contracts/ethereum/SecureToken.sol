// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SecureToken
 * @dev Production-hardened ERC20 token with security best practices
 * @notice Implements blacklisting, pausable transfers, and supply cap
 */

import "@openzeppelin/contracts@4.9.3/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@4.9.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.3/security/Pausable.sol";
import "@openzeppelin/contracts@4.9.3/security/ReentrancyGuard.sol";

contract SecureToken is ERC20, Ownable, Pausable, ReentrancyGuard {
    // ─── Constants ────────────────────────────
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18;
    uint256 public constant INITIAL_SUPPLY = 100_000 * 10**18;

    // ─── State Variables ──────────────────────
    mapping(address => bool) public blacklist;

    // ─── Events ───────────────────────────────
    event AddressBlacklisted(address indexed account, address indexed by);
    event AddressWhitelisted(address indexed account, address indexed by);
    event TokensMinted(address indexed to, uint256 amount, uint256 newTotalSupply);
    event TokensBurned(address indexed from, uint256 amount, uint256 newTotalSupply);

    // ─── Constructor ──────────────────────────
    constructor() ERC20("SecureToken", "STKN") {
        require(INITIAL_SUPPLY <= MAX_SUPPLY, "Initial supply exceeds max");
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // ─── Minting ──────────────────────────────

    /**
     * @dev Mint new tokens (owner only)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(
        address to,
        uint256 amount
    )
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Cannot mint zero tokens");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(to, amount);
        emit TokensMinted(to, amount, totalSupply());
    }

    // ─── Burning ──────────────────────────────

    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external whenNotPaused nonReentrant {
        require(!blacklist[msg.sender], "Sender is blacklisted");
        require(amount > 0, "Cannot burn zero tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, totalSupply());
    }

    // ─── Blacklist Management ─────────────────

    /**
     * @dev Add address to blacklist
     * @param account Address to blacklist
     */
    function addToBlacklist(address account) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(account != owner(), "Cannot blacklist owner");
        require(!blacklist[account], "Already blacklisted");

        blacklist[account] = true;
        emit AddressBlacklisted(account, msg.sender);
    }

    /**
     * @dev Batch add addresses to blacklist (gas-efficient)
     * @param accounts Array of addresses to blacklist
     */
    function batchAddToBlacklist(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            require(accounts[i] != address(0), "Invalid address in batch");
            require(accounts[i] != owner(), "Cannot blacklist owner");
            if (!blacklist[accounts[i]]) {
                blacklist[accounts[i]] = true;
                emit AddressBlacklisted(accounts[i], msg.sender);
            }
        }
    }

    /**
     * @dev Remove address from blacklist
     * @param account Address to whitelist
     */
    function removeFromBlacklist(address account) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(blacklist[account], "Not blacklisted");

        blacklist[account] = false;
        emit AddressWhitelisted(account, msg.sender);
    }

    /**
     * @dev Check if address is blacklisted
     * @param account Address to check
     * @return bool Blacklist status
     */
    function isBlacklisted(address account) public view returns (bool) {
        return blacklist[account];
    }

    // ─── Pause Control ────────────────────────

    /**
     * @dev Pause all token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause all token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ─── Ownership Protection ─────────────────

    /**
     * @dev Prevent accidental ownership renouncement
     */
    function renounceOwnership() public virtual override onlyOwner {
        revert("Cannot renounce ownership: use transferOwnership instead");
    }

    // ─── Internal Hooks ───────────────────────

    /**
     * @dev Hook called before any token transfer
     * @param from Sender address (zero for minting)
     * @param to Recipient address (zero for burning)
     * @param amount Transfer amount
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    )
        internal
        virtual
        override
        whenNotPaused
    {
        // Only check blacklist for actual transfers (not minting/burning)
        if (from != address(0)) {
            require(!blacklist[from], "Sender is blacklisted");
        }
        if (to != address(0)) {
            require(!blacklist[to], "Recipient is blacklisted");
        }

        super._beforeTokenTransfer(from, to, amount);
    }
}