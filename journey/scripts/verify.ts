import { run } from "hardhat";
import deploymentInfo from "../deployment-info.json";

async function main() {
  console.log("🔍 Starting contract verification...");

  const contracts = deploymentInfo.contracts;

  try {
    // Verify VehicleRegistry
    console.log("Verifying VehicleRegistry...");
    await run("verify:verify", {
      address: contracts.VehicleRegistry,
      constructorArguments: [],
    });

    // Verify ChargingStationManager
    console.log("Verifying ChargingStationManager...");
    await run("verify:verify", {
      address: contracts.ChargingStationManager,
      constructorArguments: [],
    });

    // Verify JourneyPlanner
    console.log("Verifying JourneyPlanner...");
    await run("verify:verify", {
      address: contracts.JourneyPlanner,
      constructorArguments: [
        contracts.VehicleRegistry,
        contracts.ChargingStationManager,
      ],
    });

    // Verify BookingManager
    console.log("Verifying BookingManager...");
    await run("verify:verify", {
      address: contracts.BookingManager,
      constructorArguments: [contracts.ChargingStationManager],
    });

    console.log("✅ All contracts verified successfully!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });