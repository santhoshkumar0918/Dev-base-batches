// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StationRegistry
 * @dev Manages the registration and status of EV charging stations
 */
contract StationRegistry is Ownable, ReentrancyGuard {
    using Counters   for Counters.Counter;
    Counters.Counter private _stationIds;
    
    enum StationStatus { Available, Busy, Limited, Offline }
    
    struct ChargingStation {
        uint256 id;
        address owner;
        string name;
        string location;
        string metadata; // JSON string with additional data (connectors, power, etc.)
        uint8 powerRating; // kW
        uint256 pricePerKWh; // in wei
        StationStatus status;
        bool isActive;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct GeoLocation {
        int256 latitude;  // Multiplied by 1e7 to store as integer
        int256 longitude; // Multiplied by 1e7 to store as integer
    }
    
    // Station ID => Station Data
    mapping(uint256 => ChargingStation) private stations;
    
    // Owner address => Station IDs
    mapping(address => uint256[]) private ownerStations;

    // Mapping to store station geolocation data
    mapping(uint256 => GeoLocation) private stationLocations;
    
    // Events
    event StationRegistered(uint256 indexed stationId, address indexed owner, string name);
    event StationUpdated(uint256 indexed stationId, address indexed owner);
    event StationStatusChanged(uint256 indexed stationId, StationStatus status);
    event StationDeactivated(uint256 indexed stationId);
    
    /**
     * @dev Register a new charging station
     */
    function registerStation(
        string memory name,
        string memory location,
        string memory metadata,
        uint8 powerRating,
        uint256 pricePerKWh,
        int256 latitude,
        int256 longitude
    ) external nonReentrant returns (uint256) {
        _stationIds.increment();
        uint256 newStationId = _stationIds.current();
        
        stations[newStationId] = ChargingStation({
            id: newStationId,
            owner: msg.sender,
            name: name,
            location: location,
            metadata: metadata,
            powerRating: powerRating,
            pricePerKWh: pricePerKWh,
            status: StationStatus.Available,
            isActive: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        stationLocations[newStationId] = GeoLocation({
            latitude: latitude,
            longitude: longitude
        });
        
        ownerStations[msg.sender].push(newStationId);
        
        emit StationRegistered(newStationId, msg.sender, name);
        
        return newStationId;
    }
    
    /**
     * @dev Update station status
     */
    function updateStationStatus(uint256 stationId, StationStatus status) external {
        require(stations[stationId].owner == msg.sender, "Not station owner");
        require(stations[stationId].isActive, "Station not active");
        
        stations[stationId].status = status;
        stations[stationId].updatedAt = block.timestamp;
        
        emit StationStatusChanged(stationId, status);
    }
    
    /**
     * @dev Update station price
     */
    function updateStationPrice(uint256 stationId, uint256 pricePerKWh) external {
        require(stations[stationId].owner == msg.sender, "Not station owner");
        require(stations[stationId].isActive, "Station not active");
        
        stations[stationId].pricePerKWh = pricePerKWh;
        stations[stationId].updatedAt = block.timestamp;
        
        emit StationUpdated(stationId, msg.sender);
    }
    
    /**
     * @dev Update station metadata
     */
    function updateStationMetadata(uint256 stationId, string memory metadata) external {
        require(stations[stationId].owner == msg.sender, "Not station owner");
        require(stations[stationId].isActive, "Station not active");
        
        stations[stationId].metadata = metadata;
        stations[stationId].updatedAt = block.timestamp;
        
        emit StationUpdated(stationId, msg.sender);
    }
    
    /**
     * @dev Deactivate a station
     */
    function deactivateStation(uint256 stationId) external {
        require(stations[stationId].owner == msg.sender, "Not station owner");
        require(stations[stationId].isActive, "Station already inactive");
        
        stations[stationId].isActive = false;
        stations[stationId].updatedAt = block.timestamp;
        
        emit StationDeactivated(stationId);
    }
    
    /**
     * @dev Get station details
     */
    function getStation(uint256 stationId) external view returns (ChargingStation memory) {
        require(stations[stationId].id == stationId, "Station does not exist");
        return stations[stationId];
    }
    
    /**
     * @dev Get station location
     */
    function getStationLocation(uint256 stationId) external view returns (GeoLocation memory) {
        require(stations[stationId].id == stationId, "Station does not exist");
        return stationLocations[stationId];
    }
    
    /**
     * @dev Get all stations owned by an address
     */
    function getStationsByOwner(address owner) external view returns (uint256[] memory) {
        return ownerStations[owner];
    }
    
    /**
     * @dev Get all active stations
     */
    function getAllActiveStations() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count active stations
        for (uint256 i = 1; i <= _stationIds.current(); i++) {
            if (stations[i].isActive) {
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        // Fill result array
        for (uint256 i = 1; i <= _stationIds.current() && resultIndex < count; i++) {
            if (stations[i].isActive) {
                result[resultIndex] = i;
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Calculate distance between two points (haversine formula)
     * For journey planning optimization
     */
    function calculateDistance(int256 lat1, int256 lon1, int256 lat2, int256 lon2) public pure returns (uint256) {
        // Implementation of haversine formula
        // This is a simplified version; in production you'd want a more accurate calculation
        
        // Convert to radians
        int256 latDiff = lat2 - lat1;
        int256 lonDiff = lon2 - lon1;
        
        // Return simplified distance metric (not actual km)
        return uint256((latDiff * latDiff) + (lonDiff * lonDiff));
    }
    
    /**
     * @dev Find stations along a route
     * @param startLat Starting latitude (multiplied by 1e7)
     * @param startLon Starting longitude (multiplied by 1e7)
     * @param endLat Ending latitude (multiplied by 1e7)
     * @param endLon Ending longitude (multiplied by 1e7)
     * @param maxDistance Maximum distance from route to find stations
     * @param maxResults Maximum number of stations to return
     */
    function findStationsAlongRoute(
        int256 startLat, 
        int256 startLon, 
        int256 endLat, 
        int256 endLon,
        uint256 maxDistance,
        uint256 maxResults
    ) external view returns (uint256[] memory) {
        // This is a simplified implementation
        // In a real application, you'd want a more sophisticated route calculation
        
        uint256[] memory stationIds = new uint256[](maxResults);
        uint256 resultCount = 0;
        
        for (uint256 i = 1; i <= _stationIds.current() && resultCount < maxResults; i++) {
            if (stations[i].isActive) {
                GeoLocation memory loc = stationLocations[i];
                
                // Calculate distance from start and end points
                uint256 distanceFromStart = calculateDistance(startLat, startLon, loc.latitude, loc.longitude);
                uint256 distanceFromEnd = calculateDistance(endLat, endLon, loc.latitude, loc.longitude);
                
                // Simplified check: if station is near either start or end point
                // or somewhere in between (based on rectangular bounding box)
                if (distanceFromStart <= maxDistance || 
                    distanceFromEnd <= maxDistance ||
                    (isBetween(loc.latitude, startLat, endLat, maxDistance) && 
                     isBetween(loc.longitude, startLon, endLon, maxDistance))) {
                    
                    stationIds[resultCount] = i;
                    resultCount++;
                }
            }
        }
        
        // Resize array to actual result count
        assembly {
            mstore(stationIds, resultCount)
        }
        
        return stationIds;
    }
    
    /**
     * @dev Check if a coordinate is between two points (with buffer)
     */
    function isBetween(int256 value, int256 bound1, int256 bound2, uint256 buffer) internal pure returns (bool) {
        int256 min = bound1 < bound2 ? bound1 : bound2;
        int256 max = bound1 > bound2 ? bound1 : bound2;
        
        return (value >= min - int256(buffer)) && (value <= max + int256(buffer));
    }
}