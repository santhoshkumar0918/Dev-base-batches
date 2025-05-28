import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const SONIC_BLAZE_RPC_URL = 
  process.env.SONIC_BLAZE_RPC_URL || "https://rpc.blaze.soniclabs.com";
const SONIC_API_KEY = process.env.SONIC_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
      evmVersion: "paris",
    },
  },
  networks: {
    hardhat: {},
    sonicBlaze: {
      url: SONIC_BLAZE_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 57054,
      gasPrice: "auto",
      timeout: 60000, // 60 seconds
    },
  },
  etherscan: {
    apiKey: {
      sonicBlaze: SONIC_API_KEY,
    },
    customChains: [
      {
        network: "sonicBlaze",
        chainId: 57054,
        urls: {
          apiURL: "https://testnet.sonicscan.org/api",
          browserURL: "https://testnet.sonicscan.org/",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;