// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStationRegistry {
    enum StationStatus { Available, Busy, Limited, Offline }
    
    struct ChargingStation {
        uint256 id;
        address owner;
        string name;
        string location;
        string metadata;
        uint8 powerRating;
        uint256 pricePerKWh;
        StationStatus status;
        bool isActive;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct GeoLocation {
        int256 latitude;
        int256 longitude;
    }
    
    function getStation(uint256 stationId) external view returns (ChargingStation memory);
    function getStationLocation(uint256 stationId) external view returns (GeoLocation memory);
    function findStationsAlongRoute(
        int256 startLat, 
        int256 startLon, 
        int256 endLat, 
        int256 endLon,
        uint256 maxDistance,
        uint256 maxResults
    ) external view returns (uint256[] memory);
}