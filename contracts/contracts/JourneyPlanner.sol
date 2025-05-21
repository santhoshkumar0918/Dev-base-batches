// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IStationRegistry.sol";
import "./interfaces/IReservations.sol";

/**
 * @title JourneyPlanner
 * @dev Supports EV journey planning with charging station recommendations
 */
contract JourneyPlanner is Ownable {
    IStationRegistry public stationRegistry;
    IReservations public reservations;
    
    struct VehicleModel {
        uint256 id;
        string make;
        string model;
        uint256 batteryCapacity; // in kWh
        uint256 range; // in km
        uint256 consumption; // in Wh/km
    }
    
    struct JourneyPlan {
        uint256 id;
        address user;
        int256 startLat;
        int256 startLon;
        int256 destLat;
        int256 destLon;
        uint256 totalDistance; // in km
        uint256 vehicleId;
        uint256 batteryLevel; // 0-100 percentage
        uint256[] recommendedStations;
        uint256 timestamp;
    }
    
    // Vehicle model ID counter
    uint256 private nextVehicleId = 1;
    
    // Journey plan ID counter
    uint256 private nextJourneyId = 1;
    
    // Mappings for data storage
    mapping(uint256 => VehicleModel) public vehicleModels;
    mapping(uint256 => JourneyPlan) public journeyPlans;
    mapping(address => uint256[]) public userJourneys;
    
    // Events
    event VehicleModelAdded(uint256 indexed id, string make, string model);
    event JourneyPlanned(uint256 indexed id, address indexed user, uint256 totalDistance);
    
    constructor(address _stationRegistry, address _reservations) {
        stationRegistry = IStationRegistry(_stationRegistry);
        reservations = IReservations(_reservations);
        
        // Add some default vehicle models
        _addVehicleModel("Tata", "Nexon EV", 40500000000, 312, 130000);
        _addVehicleModel("MG", "ZS EV", 50300000000, 461, 109000);
        _addVehicleModel("Hyundai", "Kona Electric", 39200000000, 305, 129000);
    }
    
   /**
     * @dev Add a new vehicle model (admin only)
     */
    function addVehicleModel(
        string memory make,
        string memory model,
        uint256 batteryCapacity,
        uint256 range,
        uint256 consumption
    ) external onlyOwner {
        _addVehicleModel(make, model, batteryCapacity, range, consumption);
    }
    
    /**
     * @dev Internal function to add a vehicle model
     */
    function _addVehicleModel(
        string memory make,
        string memory model,
        uint256 batteryCapacity,
        uint256 range,
        uint256 consumption
    ) internal {
        vehicleModels[nextVehicleId] = VehicleModel({
            id: nextVehicleId,
            make: make,
            model: model,
            batteryCapacity: batteryCapacity,
            range: range,
            consumption: consumption
        });
        
        emit VehicleModelAdded(nextVehicleId, make, model);
        nextVehicleId++;
    }
    
    /**
     * @dev Plan a journey with charging recommendations
     */
    function planJourney(
        int256 startLat,
        int256 startLon,
        int256 destLat,
        int256 destLon,
        uint256 vehicleId,
        uint256 batteryLevel
    ) external returns (uint256) {
        require(vehicleModels[vehicleId].id == vehicleId, "Vehicle model not found");
        require(batteryLevel <= 100, "Invalid battery level");
        
        // Calculate total journey distance (simplified)
        uint256 totalDistance = _calculateDistance(startLat, startLon, destLat, destLon);
        
        // Find stations along the route
        uint256 maxDistance = 5000000; // 50 km in our coordinate system
        uint256 maxResults = 10;
        uint256[] memory stationsAlongRoute = stationRegistry.findStationsAlongRoute(
            startLat, startLon, destLat, destLon, maxDistance, maxResults
        );
        
        // Sort stations by optimal charging strategy
        uint256[] memory recommendedStations = _optimizeChargingStops(
            startLat,
            startLon,
            destLat,
            destLon,
            totalDistance,
            vehicleId,
            batteryLevel,
            stationsAlongRoute
        );
        
        // Create journey plan
        JourneyPlan memory newPlan = JourneyPlan({
            id: nextJourneyId,
            user: msg.sender,
            startLat: startLat,
            startLon: startLon,
            destLat: destLat,
            destLon: destLon,
            totalDistance: totalDistance,
            vehicleId: vehicleId,
            batteryLevel: batteryLevel,
            recommendedStations: recommendedStations,
            timestamp: block.timestamp
        });
        
        journeyPlans[nextJourneyId] = newPlan;
        userJourneys[msg.sender].push(nextJourneyId);
        
        emit JourneyPlanned(nextJourneyId, msg.sender, totalDistance);
        
        uint256 journeyId = nextJourneyId;
        nextJourneyId++;
        
        return journeyId;
    }
    
    /**
     * @dev Calculate distance between coordinates (simplified)
     */
    function _calculateDistance(
        int256 startLat,
        int256 startLon,
        int256 destLat,
        int256 destLon
    ) internal pure returns (uint256) {
        // Simple Euclidean distance for demonstration
        // In a real application, we'd use the Haversine formula
        int256 latDiff = destLat - startLat;
        int256 lonDiff = destLon - startLon;
        
        // Convert to km (very approximate)
        uint256 distance = uint256(
            sqrt((latDiff * latDiff) + (lonDiff * lonDiff)) / 100000
        );
        
        return distance;
    }
    
    /**
     * @dev Simple square root function
     */
    function sqrt(int256 x) internal pure returns (int256) {
        int256 z = (x + 1) / 2;
        int256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    /**
     * @dev Optimize charging stops based on vehicle range
     */
    function _optimizeChargingStops(
        int256 startLat,
        int256 startLon,
        int256 destLat,
        int256 destLon,
        uint256 totalDistance,
        uint256 vehicleId,
        uint256 batteryLevel,
        uint256[] memory stationsAlongRoute
    ) internal view returns (uint256[] memory) {
        VehicleModel memory vehicle = vehicleModels[vehicleId];
        
        // Calculate current range based on battery level
        uint256 currentRange = (vehicle.range * batteryLevel) / 100;
        
        // If current range is enough, no charging needed
        if (currentRange >= totalDistance) {
            return new uint256[](0);
        }
        
        // For MVP, we'll use a simple algorithm:
        // 1. Calculate the position at which we need to charge (80% of current range)
        // 2. Find the closest station to that position
        // 3. Repeat until destination is reachable
        
        uint256[] memory result = new uint256[](stationsAlongRoute.length);
        uint256 resultCount = 0;
        
        int256 currentLat = startLat;
        int256 currentLon = startLon;
        uint256 remainingDistance = totalDistance;
        
        while (currentRange < remainingDistance && resultCount < stationsAlongRoute.length) {
            // Safe range is 80% of current range to avoid running out of battery
            uint256 safeRange = (currentRange * 80) / 100;
            
            // Find position at safe range
            int256 ratio = int256((safeRange * 100) / remainingDistance);
            int256 nextLat = currentLat + ((destLat - currentLat) * ratio) / 100;
            int256 nextLon = currentLon + ((destLon - currentLon) * ratio) / 100;
            
            // Find closest station to this position
            uint256 closestStation = 0;
            uint256 minDistance = type(uint256).max;
            
            for (uint256 i = 0; i < stationsAlongRoute.length; i++) {
                // Skip already selected stations
                bool alreadySelected = false;
                for (uint256 j = 0; j < resultCount; j++) {
                    if (result[j] == stationsAlongRoute[i]) {
                        alreadySelected = true;
                        break;
                    }
                }
                
                if (alreadySelected) {
                    continue;
                }
                
                // Get station location
                IStationRegistry.GeoLocation memory loc = stationRegistry.getStationLocation(stationsAlongRoute[i]);
                
                // Calculate distance from ideal position
                uint256 distance = uint256(
                    ((loc.latitude - nextLat) * (loc.latitude - nextLat)) + 
                    ((loc.longitude - nextLon) * (loc.longitude - nextLon))
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestStation = stationsAlongRoute[i];
                }
            }
            
            if (closestStation == 0) {
                // No suitable station found
                break;
            }
            
            // Add to result
            result[resultCount] = closestStation;
            resultCount++;
            
            // Update current position to selected station location
            IStationRegistry.GeoLocation memory stationLoc = stationRegistry.getStationLocation(closestStation);
            currentLat = stationLoc.latitude;
            currentLon = stationLoc.longitude;
            
            // Recalculate remaining distance
            remainingDistance = uint256(
                sqrt(
                    ((destLat - currentLat) * (destLat - currentLat)) + 
                    ((destLon - currentLon) * (destLon - currentLon))
                ) / 100000
            );
            
            // Assume charging to 90%
            currentRange = (vehicle.range * 90) / 100;
        }
        
        // Resize the result array
        uint256[] memory optimizedResult = new uint256[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            optimizedResult[i] = result[i];
        }
        
        return optimizedResult;
    }
    
    /**
     * @dev Get a journey plan by ID
     */
    function getJourneyPlan(uint256 journeyId) external view returns (JourneyPlan memory) {
        require(journeyPlans[journeyId].id == journeyId, "Journey plan not found");
        return journeyPlans[journeyId];
    }
    
    /**
     * @dev Get all journeys for a user
     */
    function getUserJourneys(address user) external view returns (uint256[] memory) {
        return userJourneys[user];
    }
    
    /**
     * @dev Get vehicle model details
     */
    function getVehicleModel(uint256 vehicleId) external view returns (VehicleModel memory) {
        require(vehicleModels[vehicleId].id == vehicleId, "Vehicle model not found");
        return vehicleModels[vehicleId];
    }
    
    /**
     * @dev Get all available vehicle models
     */
    function getAllVehicleModels() external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](nextVehicleId - 1);
        
        for (uint256 i = 1; i < nextVehicleId; i++) {
            result[i - 1] = i;
        }
        
        return result;
    }
    
    /**
     * @dev Check availability and wait times for stations
     */
    function getStationAvailability(uint256[] calldata stationIds) external view returns (
        uint256[] memory queueLengths,
        uint256[] memory waitTimes
    ) {
        queueLengths = new uint256[](stationIds.length);
        waitTimes = new uint256[](stationIds.length);
        
        for (uint256 i = 0; i < stationIds.length; i++) {
            uint256[] memory queue = reservations.getStationQueue(stationIds[i]);
            queueLengths[i] = queue.length;
            
            if (queue.length > 0) {
                waitTimes[i] = reservations.getEstimatedWaitTime(stationIds[i], 0);
            } else {
                waitTimes[i] = 0;
            }
        }
        
        return (queueLengths, waitTimes);
    }
    
    /**
     * @dev Reserve at recommended station
     */
    function reserveAtRecommendedStation(
        uint256 journeyId,
        uint256 stationId,
        uint256 estimatedDuration
    ) external returns (uint256) {
        require(journeyPlans[journeyId].id == journeyId, "Journey plan not found");
        require(journeyPlans[journeyId].user == msg.sender, "Not journey owner");
        
        // Verify station is in recommended list
        bool isRecommended = false;
        for (uint256 i = 0; i < journeyPlans[journeyId].recommendedStations.length; i++) {
            if (journeyPlans[journeyId].recommendedStations[i] == stationId) {
                isRecommended = true;
                break;
            }
        }
        
        require(isRecommended, "Station not in recommended list");
        
        // Create reservation
        return reservations.createImmediateReservation(stationId, estimatedDuration);
    }
}