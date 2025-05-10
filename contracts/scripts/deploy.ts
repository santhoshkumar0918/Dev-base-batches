import { ethers } from "hardhat";
import * as fs from "fs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  console.log("Network:", (await ethers.provider.getNetwork()).name);

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  try {
    // Deploy EVToken
    console.log("Deploying EVToken...");
    const EVToken = await ethers.getContractFactory("EVToken");
    const evToken = await EVToken.deploy();
    await evToken.deploymentTransaction().wait(2); // Wait for 2 confirmations
    const evTokenAddress = await evToken.getAddress();
    console.log("EVToken deployed to:", evTokenAddress);
    updateEnv("EV_TOKEN_ADDRESS", evTokenAddress);

    // Deploy UserRegistry
    console.log("Deploying UserRegistry...");
    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    const userRegistry = await UserRegistry.deploy();
    await userRegistry.deploymentTransaction().wait(2);
    const userRegistryAddress = await userRegistry.getAddress();
    console.log("UserRegistry deployed to:", userRegistryAddress);
    updateEnv("USER_REGISTRY_ADDRESS", userRegistryAddress);

    // Deploy StationRegistry
    console.log("Deploying StationRegistry...");
    const StationRegistry = await ethers.getContractFactory("StationRegistry");
    const stationRegistry = await StationRegistry.deploy();
    await stationRegistry.deploymentTransaction().wait(2);
    const stationRegistryAddress = await stationRegistry.getAddress();
    console.log("StationRegistry deployed to:", stationRegistryAddress);
    updateEnv("STATION_REGISTRY_ADDRESS", stationRegistryAddress);

    // Deploy ChargingSession
    console.log("Deploying ChargingSession...");
    const ChargingSession = await ethers.getContractFactory("ChargingSession");
    const chargingSession = await ChargingSession.deploy(
      userRegistryAddress,
      stationRegistryAddress,
      evTokenAddress
    );
    await chargingSession.deploymentTransaction().wait(2);
    const chargingSessionAddress = await chargingSession.getAddress();
    console.log("ChargingSession deployed to:", chargingSessionAddress);
    updateEnv("CHARGING_SESSION_ADDRESS", chargingSessionAddress);

    // Deploy BookingSystem
    console.log("Deploying BookingSystem...");
    const BookingSystem = await ethers.getContractFactory("BookingSystem");
    const bookingSystem = await BookingSystem.deploy(
      userRegistryAddress,
      stationRegistryAddress,
      evTokenAddress
    );
    await bookingSystem.deploymentTransaction().wait(2);
    const bookingSystemAddress = await bookingSystem.getAddress();
    console.log("BookingSystem deployed to:", bookingSystemAddress);
    updateEnv("BOOKING_SYSTEM_ADDRESS", bookingSystemAddress);

    // Deploy Governance
    console.log("Deploying Governance...");
    const Governance = await ethers.getContractFactory("Governance");
    const governance = await Governance.deploy(evTokenAddress, userRegistryAddress);
    await governance.deploymentTransaction().wait(2);
    const governanceAddress = await governance.getAddress();
    console.log("Governance deployed to:", governanceAddress);
    updateEnv("GOVERNANCE_ADDRESS", governanceAddress);

    // Deploy RewardSystem (if needed)
    console.log("Deploying RewardSystem...");
    const RewardSystem = await ethers.getContractFactory("RewardSystem");
    const rewardSystem = await RewardSystem.deploy(
      evTokenAddress,
      userRegistryAddress,
      stationRegistryAddress
    );
    await rewardSystem.deploymentTransaction().wait(2);
    const rewardSystemAddress = await rewardSystem.getAddress();
    console.log("RewardSystem deployed to:", rewardSystemAddress);
    updateEnv("REWARD_SYSTEM_ADDRESS", rewardSystemAddress);

    console.log("\nAll contracts deployed successfully!");
    
    // Save deployment information to a JSON file
    const networkName = (await ethers.provider.getNetwork()).name;
    const timestamp = Math.floor(Date.now() / 1000);
    
    const deploymentInfo = {
      network: networkName,
      chainId: (await ethers.provider.getNetwork()).chainId,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        EVToken: evTokenAddress,
        UserRegistry: userRegistryAddress,
        StationRegistry: stationRegistryAddress,
        ChargingSession: chargingSessionAddress,
        BookingSystem: bookingSystemAddress,
        Governance: governanceAddress,
        RewardSystem: rewardSystemAddress
      }
    };

    fs.writeFileSync(
      path.join(deploymentsDir, `deployment-${networkName}-${timestamp}.json`),
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`Deployment info saved to: deployments/deployment-${networkName}-${timestamp}.json`);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}

function updateEnv(key: string, value: string) {
  // Read .env file
  const envPath = './.env';
  let envFile = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  
  // Update or add environment variable
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(envFile)) {
    envFile = envFile.replace(regex, `${key}=${value}`);
  } else {
    envFile += `\n${key}=${value}`;
  }
  
  // Write back to .env file
  fs.writeFileSync(envPath, envFile.trim());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});