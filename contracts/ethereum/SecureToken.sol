// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SecureToken
 * @dev Example of a secure ERC20 token implementation with best practices
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureToken is ERC20, Ownable, Pausable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18;
    
    mapping(address => bool) public blacklist;
    
    event AddressBlacklisted(address indexed account);
    event AddressWhitelisted(address indexed account);
    
    constructor() ERC20("SecureToken", "STKN") {
        _mint(msg.sender, 100000 * 10**18);
    }
    
    /**
     * @dev Mints new tokens
     * @param to Address to receive tokens
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Burns tokens from caller's balance
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Adds address to blacklist
     * @param account Address to blacklist
     */
    function addToBlacklist(address account) external onlyOwner {
        blacklist[account] = true;
        emit AddressBlacklisted(account);
    }
    
    /**
     * @dev Removes address from blacklist
     * @param account Address to whitelist
     */
    function removeFromBlacklist(address account) external onlyOwner {
        blacklist[account] = false;
        emit AddressWhitelisted(account);
    }
    
    /**
     * @dev Pauses all token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpauses all token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer function with security checks
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        require(!blacklist[from], "Sender is blacklisted");
        require(!blacklist[to], "Recipient is blacklisted");
        super._beforeTokenTransfer(from, to, amount);
    }
}
