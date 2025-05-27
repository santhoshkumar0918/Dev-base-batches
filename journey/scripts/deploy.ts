import { ethers } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  // Deploy VehicleRegistry
  console.log("\n📱 Deploying VehicleRegistry...");
  const VehicleRegistry = await ethers.getContractFactory("VehicleRegistry");
  const vehicleRegistry = await VehicleRegistry.deploy();
  await vehicleRegistry.deployed();
  console.log("✅ VehicleRegistry deployed to:", vehicleRegistry.address);

  // Deploy ChargingStationManager
  console.log("\n🔌 Deploying ChargingStationManager...");
  const ChargingStationManager = await ethers.getContractFactory("ChargingStationManager");
  const chargingStationManager = await ChargingStationManager.deploy();
  await chargingStationManager.deployed();
  console.log("✅ ChargingStationManager deployed to:", chargingStationManager.address);

  // Deploy JourneyPlanner
  console.log("\n🗺️ Deploying JourneyPlanner...");
  const JourneyPlanner = await ethers.getContractFactory("JourneyPlanner");
  const journeyPlanner = await JourneyPlanner.deploy(
    vehicleRegistry.address,
    chargingStationManager.address
  );
  await journeyPlanner.deployed();
  console.log("✅ JourneyPlanner deployed to:", journeyPlanner.address);

  // Deploy BookingManager
  console.log("\n📅 Deploying BookingManager...");
  const BookingManager = await ethers.getContractFactory("BookingManager");
  const bookingManager = await BookingManager.deploy(chargingStationManager.address);
  await bookingManager.deployed();
  console.log("✅ BookingManager deployed to:", bookingManager.address);

  // Initialize with some sample data
  console.log("\n🔧 Initializing contracts with sample data...");
  
  // Add sample vehicles
  await vehicleRegistry.addVehicle("e6", "BYD", 71700, 415, 80); // BYD e6
  await vehicleRegistry.addVehicle("Model 3", "Tesla", 75000, 448, 120); // Tesla Model 3
  await vehicleRegistry.addVehicle("EQS", "Mercedes", 107800, 770, 200); // Mercedes EQS
  await vehicleRegistry.addVehicle("i4", "BMW", 83900, 590, 150); // BMW i4
  console.log("✅ Sample vehicles added");

  // Add sample charging stations
  await chargingStationManager.addChargingStation(
    "Highway EnergyHub",
    "Highway NH45, Villupuram",
    11970000, // Latitude * 1000000
    79510000, // Longitude * 1000000
    4, // Total slots
    utils.parseUnits("0.12", "ether"), // Price per kWh in ETH
    ethers.utils.parseUnits("0.12", "ether"), // Price per kWh in ETH
    ["Restroom", "Café", "WiFi"]
  );

  await chargingStationManager.addChargingStation(
    "GreenCharge Madurai",
    "Madurai Bypass Road",
    9920000,
    78120000,
    6,
    120,
    ethers.utils.parseUnits("0.10", "ether"),
    ["Restaurant", "Shopping", "Restroom"]
  );

  await chargingStationManager.addChargingStation(
    "PowerHub Chennai",
    "Chennai OMR",
    12820000,
    80270000,
    8,
    180,
    ethers.utils.parseUnits("0.15", "ether"),
    ["Food Court", "Rest Area", "WiFi", "Shopping"]
  );

  console.log("✅ Sample charging stations added");

  // Save deployment addresses
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      VehicleRegistry: vehicleRegistry.address,
      ChargingStationManager: chargingStationManager.address,
      JourneyPlanner: journeyPlanner.address,
      BookingManager: bookingManager.address,
    },
    abis: {
      VehicleRegistry: VehicleRegistry.interface.format(true),
      ChargingStationManager: ChargingStationManager.interface.format(true),
      JourneyPlanner: JourneyPlanner.interface.format(true),
      BookingManager: BookingManager.interface.format(true),
    }
  };

  writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📄 Deployment info saved to deployment-info.json");
  console.log("\n📋 Contract Addresses:");
  console.log("VehicleRegistry:", vehicleRegistry.address);
  console.log("ChargingStationManager:", chargingStationManager.address);
  console.log("JourneyPlanner:", journeyPlanner.address);
  console.log("BookingManager:", bookingManager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });