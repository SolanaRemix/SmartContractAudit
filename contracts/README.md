# Contracts

This directory contains smart contract examples for different blockchain networks.

## Structure

- **ethereum/** - EVM-compatible contracts (Ethereum, BSC, Polygon, etc.)
- **solana/** - Solana programs
- **examples/** - Example contracts for testing and demonstration

## Ethereum Contracts

### SecureToken.sol
A secure ERC20 token implementation following best practices:
- Uses OpenZeppelin libraries
- Implements access control
- Has pause functionality
- Protected against reentrancy
- Blacklist functionality

### VulnerableToken.sol
**WARNING: Educational purposes only!**

Contains intentional vulnerabilities:
- No access control on mint
- Integer overflow possibilities
- tx.origin authentication
- Unchecked external calls
- Reentrancy vulnerability
- Unsafe delegatecall
- Unprotected selfdestruct

### HoneypotExample.sol
**WARNING: Educational purposes only!**

Example of a honeypot contract:
- Hidden transfer restrictions
- Whitelist-only selling
- High fees for non-whitelisted addresses
- Backdoor functions
- Trading control by owner

## Usage

These contracts are for:
1. Testing the audit system
2. Educational purposes
3. Demonstrating vulnerabilities
4. Benchmarking detection capabilities

**DO NOT deploy vulnerable contracts to mainnet!**

## Compiling

```bash
npm run compile
```

## Testing

```bash
npm run test:contracts
```

## Auditing

Scan contracts with:
```bash
npm run scan -- --file contracts/ethereum/VulnerableToken.sol
```
