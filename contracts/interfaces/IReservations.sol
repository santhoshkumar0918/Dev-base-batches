// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IReservations {
    enum ReservationStatus { Pending, Active, Completed, Cancelled }
    enum ReservationType { Immediate, Scheduled }
    
    struct Reservation {
        uint256 id;
        uint256 stationId;
        address user;
        uint256 timestamp;
        uint256 scheduledTime;
        uint256 estimatedDuration;
        ReservationType reservationType;
        ReservationStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    function createImmediateReservation(
        uint256 stationId,
        uint256 estimatedDuration
    ) external returns (uint256);
    
    function createScheduledReservation(
        uint256 stationId,
        uint256 scheduledTime,
        uint256 estimatedDuration
    ) external returns (uint256);
    
    function getReservation(uint256 reservationId) external view returns (Reservation memory);
    function getStationQueue(uint256 stationId) external view returns (uint256[] memory);
    function getEstimatedWaitTime(uint256 stationId, uint256 position) external view returns (uint256);
    function getActiveReservationsForStations(uint256[] calldata stationIds) external view returns (uint256[][] memory);
}