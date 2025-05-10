// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./libraries/Structs.sol";  // Import the Structs library

interface IStationRegistry {
    function registerStation(
        string memory stationType,
        string memory name,
        string memory metadata
    ) external returns (uint256);
    
    function addCharger(
        uint256 stationId,
        string memory chargerType,
        uint256 powerOutput,
        uint256 pricePerKWh
    ) external returns (uint256);
    
    function updateChargerStatus(uint256 stationId, uint256 chargerId, bool isAvailable) external;
    function updateStationStatus(uint256 stationId, bool isActive) external;
    function getStation(uint256 stationId) external view returns (Structs.Station memory);
    function getCharger(uint256 stationId, uint256 chargerId) external view returns (Structs.Charger memory);
    function getStationsByOwner(address owner) external view returns (uint256[] memory);
    function getActiveStations() external view returns (uint256[] memory);
    function updateStationReputation(uint256 stationId, uint256 reputationChange, bool isPositive) external;
}