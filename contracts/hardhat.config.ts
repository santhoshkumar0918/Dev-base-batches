import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";
dotenv.config();

// Default values for environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const ALCHEMY_BASE_MAINNET_API_KEY = process.env.ALCHEMY_BASE_MAINNET_API_KEY || "";
const ALCHEMY_BASE_TESTNET_API_KEY = process.env.ALCHEMY_BASE_TESTNET_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
    },
    // Base Mainnet
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_BASE_MAINNET_API_KEY}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 8453,
      gasPrice: "auto",
    },
    // Base Sepolia Testnet
    "base-sepolia": {
      url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_BASE_TESTNET_API_KEY}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 84532,
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: {
      base: ETHERSCAN_API_KEY,
      "base-sepolia": ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  // Gas usage reporting
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    excludeContracts: [],
    src: "./contracts",
    outputFile: process.env.GAS_REPORT_FILE ? "./gas-report.txt" : undefined,
    noColors: process.env.GAS_REPORT_FILE ? true : false,
    showTimeSpent: true,
    showMethodSig: true,
  },
  // Project paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // Mocha testing configuration
  mocha: {
    timeout: 100000, // increased timeout for complex test flows
  },
};

export default config;