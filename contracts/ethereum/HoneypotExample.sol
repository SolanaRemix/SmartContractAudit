// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HoneypotExample
 * @dev EDUCATIONAL EXAMPLE - Demonstrates common honeypot patterns
 * 
 * WARNING: THIS CONTRACT INTENTIONALLY CONTAINS HONEYPOT MECHANISMS
 * FOR EDUCATIONAL AND TESTING PURPOSES ONLY.
 * 
 * Documented features for scanner detection testing:
 * 1. Hidden whitelist-based transfer restrictions
 * 2. Transfer fee for non-whitelisted users (capped at 10%)
 * 3. Centralized owner control over trading
 * 
 * PRODUCTION NOTE: Deploy ONLY to testnets for security scanner validation.
 * Never deploy to mainnet.
 */

contract HoneypotExample {
    string public name = "HoneypotToken";
    string public symbol = "HONEY";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1_000_000 * 10**18;

    address private owner;
    bool private tradingEnabled = false;

    mapping(address => uint256) public balanceOf;
    mapping(address => bool) private whitelist;
    mapping(address => uint256) public feesPaid; // Transparent fee tracking

    event Transfer(address indexed from, address indexed to, uint256 value);
    event FeeCharged(address indexed from, uint256 feeAmount, uint256 receivedAmount);
    event WhitelistUpdated(address indexed account, bool status);
    event TradingToggled(bool enabled);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyTestnet() {
        require(block.chainid != 1, "Cannot deploy to Ethereum mainnet");
        _;
    }

    constructor() onlyTestnet {
        require(msg.sender != address(0), "Invalid owner");
        owner = msg.sender;
        balanceOf[owner] = totalSupply;
        whitelist[owner] = true;
        emit Transfer(address(0), owner, totalSupply);
        emit WhitelistUpdated(owner, true);
    }

    // ─────────────────────────────────────────────
    // Public Functions
    // ─────────────────────────────────────────────

    /**
     * @dev Transfer tokens with documented fee structure
     * @param _to Recipient address
     * @param _value Amount to transfer
     * @return bool Success
     * 
     * EDUCATIONAL NOTE: Non-whitelisted users are charged a 10% fee.
     * This is a classic honeypot indicator that scanners should flag.
     * The PR capped this from the original 90% to demonstrate the
     * recommended remediation (reducing/documenting the fee).
     */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(_to != address(this), "Cannot transfer to contract self");
        require(_value > 0, "Transfer value must be positive");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        require(whitelist[msg.sender] || tradingEnabled, "Trading restricted");

        uint256 fee = whitelist[msg.sender] ? 0 : (_value * 10) / 100;
        uint256 transferAmount = _value - fee;

        require(transferAmount > 0 || whitelist[msg.sender], "Transfer too small after fee");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += transferAmount;

        if (fee > 0) {
            balanceOf[owner] += fee;
            feesPaid[msg.sender] += fee;
            emit FeeCharged(msg.sender, fee, transferAmount);
            emit Transfer(msg.sender, owner, fee);
        }

        emit Transfer(msg.sender, _to, transferAmount);
        return true;
    }

    // ─────────────────────────────────────────────
    // Whitelist Management
    // ─────────────────────────────────────────────

    /**
     * @dev Add address to transfer whitelist
     * @param _address Address to whitelist
     */
    function addToWhitelist(address _address) external onlyOwner {
        require(_address != address(0), "Invalid address");
        require(!whitelist[_address], "Already whitelisted");
        whitelist[_address] = true;
        emit WhitelistUpdated(_address, true);
    }

    /**
     * @dev Remove address from transfer whitelist
     * @param _address Address to remove
     */
    function removeFromWhitelist(address _address) external onlyOwner {
        require(_address != owner, "Cannot remove owner from whitelist");
        require(whitelist[_address], "Not whitelisted");
        whitelist[_address] = false;
        emit WhitelistUpdated(_address, false);
    }

    /**
     * @dev Check if address is whitelisted
     * @param _address Address to check
     * @return bool Whitelist status
     */
    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    /**
     * @dev Get current fee percentage for an address
     * @param _address Address to check
     * @return uint256 Fee percentage (0-100)
     */
    function getFeePercent(address _address) public view returns (uint256) {
        return whitelist[_address] ? 0 : 10;
    }

    // ─────────────────────────────────────────────
    // Trading Controls
    // ─────────────────────────────────────────────

    /**
     * @dev Enable public trading
     */
    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "Trading already enabled");
        tradingEnabled = true;
        emit TradingToggled(true);
    }

    /**
     * @dev Disable public trading (emergency pause)
     */
    function disableTrading() external onlyOwner {
        require(tradingEnabled, "Trading already disabled");
        tradingEnabled = false;
        emit TradingToggled(false);
    }

    // ─────────────────────────────────────────────
    // Owner Management
    // ─────────────────────────────────────────────

    /**
     * @dev Transfer contract ownership
     * @param _newOwner New owner address
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        require(_newOwner != owner, "Already owner");
        owner = _newOwner;
    }

    // ─────────────────────────────────────────────
    // REMOVED FROM ORIGINAL (BACKDOORS):
    // ❌ tranfer()  — typosquatting function DELETED
    // ❌ updateBalance() — hidden mint DELETED
    // 
    // These were intentional honeypot backdoors for
    // scanner detection testing. Production contracts
    // must NEVER include hidden balance manipulation.
    // ─────────────────────────────────────────────
}
