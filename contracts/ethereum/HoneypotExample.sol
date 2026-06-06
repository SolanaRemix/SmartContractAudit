// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title HoneypotExample
 * @dev Example honeypot contract that traps funds
 * WARNING: This is for educational purposes only!
 */

contract HoneypotExample {
    string public name = "HoneypotToken";
    string public symbol = "HONEY";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    address private owner;
    bool private tradingEnabled = false;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) private whitelist;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        balanceOf[owner] = totalSupply;
        whitelist[owner] = true;
    }
    
    // Transfer function with documented fee structure
    // NOTE: This contract implements a fee mechanism for non-whitelisted addresses
    // Maximum fee is capped at 10% for transparency
    function transfer(address _to, uint256 _value) public returns (bool) {
        // Only whitelisted addresses can transfer when trading is disabled
        require(whitelist[msg.sender] || tradingEnabled, "Trading not enabled");
        
        // Transfer fee: 0% for whitelisted, max 10% for others (down from 90%)
        uint256 feePercentage = whitelist[msg.sender] ? 0 : 10;
        uint256 fee = _value * feePercentage / 100;
        uint256 transferAmount = _value - fee;
        
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += transferAmount;
        balanceOf[owner] += fee; // Fee goes to owner
        
        emit Transfer(msg.sender, _to, transferAmount);
        if (fee > 0) {
            emit Transfer(msg.sender, owner, fee);
        }
        
        return true;
    }
    
    // Owner can add addresses to whitelist
    function addToWhitelist(address _address) external onlyOwner {
        whitelist[_address] = true;
    }
    
    // Owner controls trading
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }
    
    // REMOVED: Hidden backdoor function "tranfer" (typo used to hide malicious functionality)
    // This was a security vulnerability that allowed arbitrary balance manipulation
}
