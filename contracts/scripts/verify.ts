import { run } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const evTokenAddress = process.env.EV_TOKEN_ADDRESS;
  const userRegistryAddress = process.env.USER_REGISTRY_ADDRESS;
  const stationRegistryAddress = process.env.STATION_REGISTRY_ADDRESS;
  const chargingSessionAddress = process.env.CHARGING_SESSION_ADDRESS;
  const bookingSystemAddress = process.env.BOOKING_SYSTEM_ADDRESS;
  const governanceAddress = process.env.GOVERNANCE_ADDRESS;
  const rewardSystemAddress = process.env.REWARD_SYSTEM_ADDRESS;

  console.log("Starting contract verification on Base Sepolia...");

  try {
    // Verify EVToken
    if (evTokenAddress) {
      console.log(`Verifying EVToken at ${evTokenAddress}...`);
      await run("verify:verify", {
        address: evTokenAddress,
        constructorArguments: [],
      });
      console.log("EVToken verified successfully!");
    }

    // Verify UserRegistry
    if (userRegistryAddress) {
      console.log(`Verifying UserRegistry at ${userRegistryAddress}...`);
      await run("verify:verify", {
        address: userRegistryAddress,
        constructorArguments: [],
      });
      console.log("UserRegistry verified successfully!");
    }

    // Verify StationRegistry
    if (stationRegistryAddress) {
      console.log(`Verifying StationRegistry at ${stationRegistryAddress}...`);
      await run("verify:verify", {
        address: stationRegistryAddress,
        constructorArguments: [],
      });
      console.log("StationRegistry verified successfully!");
    }

    // Verify ChargingSession
    if (chargingSessionAddress && userRegistryAddress && stationRegistryAddress && evTokenAddress) {
      console.log(`Verifying ChargingSession at ${chargingSessionAddress}...`);
      await run("verify:verify", {
        address: chargingSessionAddress,
        constructorArguments: [
          userRegistryAddress,
          stationRegistryAddress,
          evTokenAddress,
        ],
      });
      console.log("ChargingSession verified successfully!");
    }

    // Verify BookingSystem
    if (bookingSystemAddress && userRegistryAddress && stationRegistryAddress && evTokenAddress) {
      console.log(`Verifying BookingSystem at ${bookingSystemAddress}...`);
      await run("verify:verify", {
        address: bookingSystemAddress,
        constructorArguments: [
          userRegistryAddress,
          stationRegistryAddress,
          evTokenAddress,
        ],
      });
      console.log("BookingSystem verified successfully!");
    }

    // Verify Governance
    if (governanceAddress && evTokenAddress && userRegistryAddress) {
      console.log(`Verifying Governance at ${governanceAddress}...`);
      await run("verify:verify", {
        address: governanceAddress,
        constructorArguments: [
          evTokenAddress,
          userRegistryAddress,
        ],
      });
      console.log("Governance verified successfully!");
    }

    // Verify RewardSystem
    if (rewardSystemAddress && evTokenAddress && userRegistryAddress && stationRegistryAddress) {
      console.log(`Verifying RewardSystem at ${rewardSystemAddress}...`);
      await run("verify:verify", {
        address: rewardSystemAddress,
        constructorArguments: [
          evTokenAddress,
          userRegistryAddress,
          stationRegistryAddress,
        ],
      });
      console.log("RewardSystem verified successfully!");
    }

    console.log("All contracts verified successfully!");
  } catch (error) {
    console.error("Error during verification:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });