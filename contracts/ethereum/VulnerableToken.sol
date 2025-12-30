// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title VulnerableToken
 * @dev Example of a vulnerable token with common security issues
 * WARNING: This contract contains intentional vulnerabilities for educational purposes
 * DO NOT deploy to mainnet!
 */

contract VulnerableToken {
    string public name = "VulnerableToken";
    string public symbol = "VULN";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    address public owner;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply * 10**uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }
    
    // VULNERABILITY: No access control on mint function
    function mint(address _to, uint256 _amount) public {
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }
    
    // VULNERABILITY: Integer overflow not checked
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value; // Overflow possible
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    // VULNERABILITY: tx.origin authentication
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "Insufficient balance");
        require(_value <= allowance[_from][msg.sender] || tx.origin == owner, "Not allowed");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    // VULNERABILITY: Unchecked external call
    function withdraw() public {
        uint256 amount = balanceOf[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        balanceOf[msg.sender] = 0; // State change after external call - reentrancy possible
    }
    
    // VULNERABILITY: Delegatecall to user-controlled address
    function execute(address _target, bytes memory _data) public returns (bool) {
        (bool success, ) = _target.delegatecall(_data);
        return success;
    }
    
    // VULNERABILITY: selfdestruct without proper access control
    function destroy() public {
        selfdestruct(payable(owner));
    }
    
    receive() external payable {}
}
