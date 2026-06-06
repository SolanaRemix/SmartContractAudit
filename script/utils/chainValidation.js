const ethers = require('ethers');
const chainsConfig = require('../../config/chains.json');
const getAddress = ethers.getAddress || ethers.utils?.getAddress;
const isAddress = ethers.isAddress || ethers.utils?.isAddress;

const DEFAULT_SUPPORTED_CHAINS = Object.entries(chainsConfig).reduce((acc, [key, value]) => {
  if (!key.startsWith('_') && value && typeof value === 'object') {
    acc[key] = {
      key,
      chainId: value.chainId,
      type: value.type,
      name: value.name
    };
  }
  return acc;
}, {});

function getSupportedChains(override = null) {
  if (!override || typeof override !== 'object') {
    return { ...DEFAULT_SUPPORTED_CHAINS };
  }

  return Object.entries(override).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object') {
      acc[key] = {
        key,
        chainId: value.chainId,
        type: value.type,
        name: value.name || key
      };
    }
    return acc;
  }, {});
}

function normalizeChain(chain, supportedChains = DEFAULT_SUPPORTED_CHAINS) {
  if (!chain || typeof chain !== 'string') {
    throw new Error('Chain must be a non-empty string');
  }

  const normalized = chain.toLowerCase().trim();
  const configured = supportedChains[normalized];

  if (!configured) {
    throw new Error(`Unsupported chain: "${chain}"`);
  }

  return normalized;
}

function isValidSolanaAddress(address) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

function validateAddressForChain(address, chain, supportedChains = DEFAULT_SUPPORTED_CHAINS) {
  if (!address || typeof address !== 'string') {
    throw new Error('Address must be a non-empty string');
  }

  const normalizedChain = normalizeChain(chain, supportedChains);
  const chainConfig = supportedChains[normalizedChain];
  const trimmedAddress = address.trim();

  if (chainConfig.type === 'evm') {
    if (!isAddress || !isAddress(trimmedAddress)) {
      throw new Error(`Invalid EVM address for chain ${normalizedChain} (chainId=${chainConfig.chainId})`);
    }
    return getAddress(trimmedAddress);
  }

  if (chainConfig.type === 'solana') {
    if (!isValidSolanaAddress(trimmedAddress)) {
      throw new Error('Invalid Solana address format');
    }
    return trimmedAddress;
  }

  throw new Error(`Unsupported chain type for ${normalizedChain}`);
}

module.exports = {
  DEFAULT_SUPPORTED_CHAINS,
  getSupportedChains,
  normalizeChain,
  validateAddressForChain
};
