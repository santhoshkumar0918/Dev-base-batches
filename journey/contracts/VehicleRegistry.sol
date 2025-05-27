// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VehicleRegistry is Ownable {
    uint256 private _vehicleIdCounter;

    struct Vehicle {
        uint256 id;
        string model;
        string brand;
        uint256 batteryCapacity; // in kWh
        uint256 range; // in km
        uint256 chargingSpeed; // in kW
        bool isActive;
        uint256 createdAt;
    }

    struct UserVehicle {
        uint256 vehicleId;
        address owner;
        string licensePlate;
        uint256 currentBatteryLevel; // percentage 0-100
        uint256 lastUpdated;
    }

    mapping(uint256 => Vehicle) public vehicles;
    mapping(address => UserVehicle[]) public userVehicles;
    mapping(uint256 => bool) public vehicleExists;

    event VehicleAdded(uint256 indexed vehicleId, string model, string brand);
    event UserVehicleRegistered(address indexed user, uint256 indexed vehicleId, string licensePlate);
    event BatteryLevelUpdated(address indexed user, uint256 indexed userVehicleIndex, uint256 batteryLevel);

    constructor() Ownable(msg.sender) {
        _vehicleIdCounter = 0;
    }

    function addVehicle(
        string memory _model,
        string memory _brand,
        uint256 _batteryCapacity,
        uint256 _range,
        uint256 _chargingSpeed
    ) external onlyOwner {
        _vehicleIdCounter++;
        uint256 vehicleId = _vehicleIdCounter;

        vehicles[vehicleId] = Vehicle({
            id: vehicleId,
            model: _model,
            brand: _brand,
            batteryCapacity: _batteryCapacity,
            range: _range,
            chargingSpeed: _chargingSpeed,
            isActive: true,
            createdAt: block.timestamp
        });

        vehicleExists[vehicleId] = true;
        emit VehicleAdded(vehicleId, _model, _brand);
    }

    function registerUserVehicle(
        uint256 _vehicleId,
        string memory _licensePlate,
        uint256 _currentBatteryLevel
    ) external {
        require(vehicleExists[_vehicleId], "Vehicle does not exist");
        require(vehicles[_vehicleId].isActive, "Vehicle is not active");
        require(_currentBatteryLevel <= 100, "Battery level cannot exceed 100%");

        userVehicles[msg.sender].push(UserVehicle({
            vehicleId: _vehicleId,
            owner: msg.sender,
            licensePlate: _licensePlate,
            currentBatteryLevel: _currentBatteryLevel,
            lastUpdated: block.timestamp
        }));

        emit UserVehicleRegistered(msg.sender, _vehicleId, _licensePlate);
    }

    function updateBatteryLevel(uint256 _userVehicleIndex, uint256 _batteryLevel) external {
        require(_userVehicleIndex < userVehicles[msg.sender].length, "Invalid vehicle index");
        require(_batteryLevel <= 100, "Battery level cannot exceed 100%");

        userVehicles[msg.sender][_userVehicleIndex].currentBatteryLevel = _batteryLevel;
        userVehicles[msg.sender][_userVehicleIndex].lastUpdated = block.timestamp;

        emit BatteryLevelUpdated(msg.sender, _userVehicleIndex, _batteryLevel);
    }

    function getVehicle(uint256 _vehicleId) external view returns (Vehicle memory) {
        require(vehicleExists[_vehicleId], "Vehicle does not exist");
        return vehicles[_vehicleId];
    }

    function getUserVehicles(address _user) external view returns (UserVehicle[] memory) {
        return userVehicles[_user];
    }

    function getTotalVehicles() external view returns (uint256) {
        return _vehicleIdCounter;
    }

    function getCurrentVehicleId() external view returns (uint256) {
        return _vehicleIdCounter;
    }
}