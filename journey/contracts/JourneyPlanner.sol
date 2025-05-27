// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./VehicleRegistry.sol";
import "./ChargingStationManager.sol";

contract JourneyPlanner {
    using Counters for Counters.Counter;
    Counters.Counter private _journeyIds;

    VehicleRegistry public vehicleRegistry;
    ChargingStationManager public chargingStationManager;

    struct Journey {
        uint256 id;
        address user;
        string origin;
        string destination;
        uint256 vehicleId;
        uint256 userVehicleIndex;
        uint256 initialBatteryLevel;
        uint256 totalDistance;
        uint256 estimatedTotalTime;
        uint256 departureTime;
        uint256 estimatedArrivalTime;
        uint256[] chargingStationIds;
        uint256 createdAt;
        JourneyStatus status;
    }

    struct ChargingStop {
        uint256 stationId;
        uint256 estimatedArrivalTime;
        uint256 estimatedDepartureTime;
        uint256 chargingDuration;
        uint256 expectedChargeAmount;
        bool isCompleted;
    }

    enum JourneyStatus { PLANNED, IN_PROGRESS, COMPLETED, CANCELLED }

    mapping(uint256 => Journey) public journeys;
    mapping(uint256 => ChargingStop[]) public journeyChargingStops;
    mapping(address => uint256[]) public userJourneys;

    event JourneyPlanned(uint256 indexed journeyId, address indexed user, string origin, string destination);
    event JourneyStarted(uint256 indexed journeyId);
    event JourneyCompleted(uint256 indexed journeyId);
    event ChargingStopAdded(uint256 indexed journeyId, uint256 indexed stationId);

    constructor(address _vehicleRegistry, address _chargingStationManager) {
        vehicleRegistry = VehicleRegistry(_vehicleRegistry);
        chargingStationManager = ChargingStationManager(_chargingStationManager);
    }

    function planJourney(
        string memory _origin,
        string memory _destination,
        uint256 _userVehicleIndex,
        uint256 _totalDistance,
        uint256 _estimatedTotalTime,
        uint256 _departureTime,
        uint256[] memory _chargingStationIds,
        ChargingStop[] memory _chargingStops
    ) external {
        VehicleRegistry.UserVehicle[] memory userVehicles = vehicleRegistry.getUserVehicles(msg.sender);
        require(_userVehicleIndex < userVehicles.length, "Invalid vehicle index");

        _journeyIds.increment();
        uint256 journeyId = _journeyIds.current();

        VehicleRegistry.UserVehicle memory userVehicle = userVehicles[_userVehicleIndex];

        journeys[journeyId] = Journey({
            id: journeyId,
            user: msg.sender,
            origin: _origin,
            destination: _destination,
            vehicleId: userVehicle.vehicleId,
            userVehicleIndex: _userVehicleIndex,
            initialBatteryLevel: userVehicle.currentBatteryLevel,
            totalDistance: _totalDistance,
            estimatedTotalTime: _estimatedTotalTime,
            departureTime: _departureTime,
            estimatedArrivalTime: _departureTime + _estimatedTotalTime,
            chargingStationIds: _chargingStationIds,
            createdAt: block.timestamp,
            status: JourneyStatus.PLANNED
        });

        // Add charging stops
        for (uint256 i = 0; i < _chargingStops.length; i++) {
            journeyChargingStops[journeyId].push(_chargingStops[i]);
            emit ChargingStopAdded(journeyId, _chargingStops[i].stationId);
        }

        userJourneys[msg.sender].push(journeyId);
        emit JourneyPlanned(journeyId, msg.sender, _origin, _destination);
    }

    function startJourney(uint256 _journeyId) external {
        require(journeys[_journeyId].user == msg.sender, "Not your journey");
        require(journeys[_journeyId].status == JourneyStatus.PLANNED, "Journey already started or completed");

        journeys[_journeyId].status = JourneyStatus.IN_PROGRESS;
        emit JourneyStarted(_journeyId);
    }

    function completeJourney(uint256 _journeyId) external {
        require(journeys[_journeyId].user == msg.sender, "Not your journey");
        require(journeys[_journeyId].status == JourneyStatus.IN_PROGRESS, "Journey not in progress");

        journeys[_journeyId].status = JourneyStatus.COMPLETED;
        emit JourneyCompleted(_journeyId);
    }

    function getJourney(uint256 _journeyId) external view returns (Journey memory, ChargingStop[] memory) {
        return (journeys[_journeyId], journeyChargingStops[_journeyId]);
    }

    function getUserJourneys(address _user) external view returns (uint256[] memory) {
        return userJourneys[_user];
    }

    function calculateOptimalRoute(
        uint256 _vehicleId,
        uint256 _currentBatteryLevel,
        uint256 _totalDistance
    ) external view returns (uint256[] memory recommendedStations) {
        VehicleRegistry.Vehicle memory vehicle = vehicleRegistry.getVehicle(_vehicleId);
        
        // Simple calculation: if journey distance > 80% of range, recommend charging
        uint256 maxDistanceOnCurrentCharge = (vehicle.range * _currentBatteryLevel) / 100;
        
        if (_totalDistance > (maxDistanceOnCurrentCharge * 80) / 100) {
            // For demo purposes, return first two available stations
            // In real implementation, this would use complex algorithms
            ChargingStationManager.ChargingStation[] memory allStations = 
                chargingStationManager.getAllChargingStations();
            
            uint256 count = 0;
            for (uint256 i = 0; i < allStations.length && count < 2; i++) {
                if (allStations[i].isActive && allStations[i].availableSlots > 0) {
                    count++;
                }
            }
            
            recommendedStations = new uint256[](count);
            count = 0;
            for (uint256 i = 0; i < allStations.length && count < 2; i++) {
                if (allStations[i].isActive && allStations[i].availableSlots > 0) {
                    recommendedStations[count] = allStations[i].id;
                    count++;
                }
            }
        }
        
        return recommendedStations;
    }
}
