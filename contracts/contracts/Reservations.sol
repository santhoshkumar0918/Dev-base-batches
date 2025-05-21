// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IStationRegistry.sol";
import "./TokenRewards.sol";

/**
 * @title Reservations
 * @dev Manages reservations and queuing for charging stations
 */
contract Reservations is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _reservationIds;
    
    // Status of a reservation
    enum ReservationStatus { Pending, Active, Completed, Cancelled }
    
    // Types of reservations
    enum ReservationType { Immediate, Scheduled }
    
    struct Reservation {
        uint256 id;
        uint256 stationId;
        address user;
        uint256 timestamp;
        uint256 scheduledTime; // 0 for immediate reservations
        uint256 estimatedDuration; // in minutes
        ReservationType reservationType;
        ReservationStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    // Interfaces
    IStationRegistry public stationRegistry;
    TokenRewards public tokenRewards;
    
    // Reservation ID => Reservation Data
    mapping(uint256 => Reservation) private reservations;
    
    // User address => Reservation IDs
    mapping(address => uint256[]) private userReservations;
    
    // Station ID => Queue of Reservation IDs
    mapping(uint256 => uint256[]) private stationQueues;
    
    // Events
    event ReservationCreated(uint256 indexed reservationId, uint256 indexed stationId, address indexed user);
    event ReservationActivated(uint256 indexed reservationId);
    event ReservationCompleted(uint256 indexed reservationId);
    event ReservationCancelled(uint256 indexed reservationId);
    event EnteredQueue(uint256 indexed reservationId, uint256 indexed stationId, uint256 position);
    
    constructor(address _stationRegistry, address _tokenRewards) {
        stationRegistry = IStationRegistry(_stationRegistry);
        tokenRewards = TokenRewards(_tokenRewards);
    }
    
    /**
     * @dev Create an immediate reservation or join queue
     */
    function createImmediateReservation(
        uint256 stationId,
        uint256 estimatedDuration
    ) external nonReentrant returns (uint256) {
        // Verify station exists and is active
        IStationRegistry.ChargingStation memory station = stationRegistry.getStation(stationId);
        require(station.isActive, "Station not active");
        
        _reservationIds.increment();
        uint256 newReservationId = _reservationIds.current();
        
        // Create reservation
        reservations[newReservationId] = Reservation({
            id: newReservationId,
            stationId: stationId,
            user: msg.sender,
            timestamp: block.timestamp,
            scheduledTime: 0, // Immediate reservation
            estimatedDuration: estimatedDuration,
            reservationType: ReservationType.Immediate,
            status: ReservationStatus.Pending,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        userReservations[msg.sender].push(newReservationId);
        
        // Add to queue
        uint256 queuePosition = stationQueues[stationId].length;
        stationQueues[stationId].push(newReservationId);
        
        emit ReservationCreated(newReservationId, stationId, msg.sender);
        emit EnteredQueue(newReservationId, stationId, queuePosition);
        
        // If first in queue, activate immediately
        if (queuePosition == 0) {
            _activateReservation(newReservationId);
        } else {
            // Award tokens for joining queue (flexible behavior)
            tokenRewards.awardTokens(msg.sender, 5); // 5 tokens for queue joining
        }
        
        return newReservationId;
    }
    
    /**
     * @dev Create a scheduled reservation for future time
     */
    function createScheduledReservation(
        uint256 stationId,
        uint256 scheduledTime,
        uint256 estimatedDuration
    ) external nonReentrant returns (uint256) {
        require(scheduledTime > block.timestamp, "Scheduled time must be in future");
        
        // Verify station exists and is active
        IStationRegistry.ChargingStation memory station = stationRegistry.getStation(stationId);
        require(station.isActive, "Station not active");
        
        // Check for time slot availability
        require(_isTimeSlotAvailable(stationId, scheduledTime, estimatedDuration), "Time slot not available");
        
        _reservationIds.increment();
        uint256 newReservationId = _reservationIds.current();
        
        // Create reservation
        reservations[newReservationId] = Reservation({
            id: newReservationId,
            stationId: stationId,
            user: msg.sender,
            timestamp: block.timestamp,
            scheduledTime: scheduledTime,
            estimatedDuration: estimatedDuration,
            reservationType: ReservationType.Scheduled,
            status: ReservationStatus.Pending,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        userReservations[msg.sender].push(newReservationId);
        
        emit ReservationCreated(newReservationId, stationId, msg.sender);
        
        // Award tokens for scheduling (flexible behavior)
        tokenRewards.awardTokens(msg.sender, 3); // 3 tokens for scheduling ahead
        
        return newReservationId;
    }
    
    /**
     * @dev Activate a reservation (internal function)
     */
    function _activateReservation(uint256 reservationId) internal {
        Reservation storage reservation = reservations[reservationId];
        
        require(reservation.id == reservationId, "Reservation does not exist");
        require(reservation.status == ReservationStatus.Pending, "Reservation not pending");
        
        reservation.status = ReservationStatus.Active;
        reservation.updatedAt = block.timestamp;
        
        emit ReservationActivated(reservationId);
    }
    
    /**
     * @dev Activate a reservation (external function)
     */
    function activateReservation(uint256 reservationId) external {
        Reservation storage reservation = reservations[reservationId];
        
        require(reservation.id == reservationId, "Reservation does not exist");
        require(reservation.status == ReservationStatus.Pending, "Reservation not pending");
        
        // If called by user, verify ownership
        if (msg.sender != owner()) {
            require(reservation.user == msg.sender, "Not reservation owner");
        }
        
        _activateReservation(reservationId);
    }
    
    /**
     * @dev Complete a reservation
     */
    function completeReservation(uint256 reservationId) external nonReentrant {
        Reservation storage reservation = reservations[reservationId];
        
        require(reservation.id == reservationId, "Reservation does not exist");
        require(reservation.status == ReservationStatus.Active, "Reservation not active");
        
        // If called by user, verify ownership
        if (msg.sender != owner()) {
            require(reservation.user == msg.sender, "Not reservation owner");
        }
        
        reservation.status = ReservationStatus.Completed;
        reservation.updatedAt = block.timestamp;
        
        emit ReservationCompleted(reservationId);
        
        // Process queue for this station
        _processQueue(reservation.stationId);
    }
    
    /**
     * @dev Cancel a reservation
     */
    function cancelReservation(uint256 reservationId) external nonReentrant {
        Reservation storage reservation = reservations[reservationId];
        
        require(reservation.id == reservationId, "Reservation does not exist");
        require(reservation.status == ReservationStatus.Pending, "Reservation not pending");
        require(reservation.user == msg.sender, "Not reservation owner");
        
        reservation.status = ReservationStatus.Cancelled;
        reservation.updatedAt = block.timestamp;
        
        emit ReservationCancelled(reservationId);
        
        // If this was a queued reservation, update the queue
        _removeFromQueue(reservation.stationId, reservationId);
    }
    
    /**
     * @dev Process the queue for a station
     */
    function _processQueue(uint256 stationId) internal {
        if (stationQueues[stationId].length > 0) {
            // Remove completed/cancelled reservations from front of queue
            while (stationQueues[stationId].length > 0) {
                uint256 frontReservationId = stationQueues[stationId][0];
                Reservation storage frontReservation = reservations[frontReservationId];
                
                if (frontReservation.status == ReservationStatus.Completed || 
                    frontReservation.status == ReservationStatus.Cancelled) {
                    // Remove from queue
                    _removeFromQueueByIndex(stationId, 0);
                } else if (frontReservation.status == ReservationStatus.Pending) {
                    // Activate next reservation
                    _activateReservation(frontReservationId);
                    break;
                } else {
                    // Active reservation at front of queue, nothing to do
                    break;
                }
            }
        }
    }
    
    /**
     * @dev Remove a reservation from a station's queue
     */
    function _removeFromQueue(uint256 stationId, uint256 reservationId) internal {
        uint256[] storage queue = stationQueues[stationId];
        
        for (uint256 i = 0; i < queue.length; i++) {
            if (queue[i] == reservationId) {
                _removeFromQueueByIndex(stationId, i);
                break;
            }
        }
    }
    
    /**
     * @dev Remove a reservation from a station's queue by index
     */
    function _removeFromQueueByIndex(uint256 stationId, uint256 index) internal {
        uint256[] storage queue = stationQueues[stationId];
        
        require(index < queue.length, "Index out of bounds");
        
        // Move all elements after index one position back
        for (uint256 i = index; i < queue.length - 1; i++) {
            queue[i] = queue[i + 1];
        }
        
        // Remove the last element
        queue.pop();
    }
    
    /**
     * @dev Check if a time slot is available
     */
    function _isTimeSlotAvailable(uint256 stationId, uint256 scheduledTime, uint256 duration) internal view returns (bool) {
        // Get all reservations for this station
        uint256[] memory activeReservations = new uint256[](100); // Assume max 100 active reservations per station
        uint256 count = 0;
        
        // Find all scheduled reservations for this station
        for (uint256 i = 1; i <= _reservationIds.current() && count < 100; i++) {
            Reservation storage reservation = reservations[i];
            
            if (reservation.stationId == stationId &&
                reservation.reservationType == ReservationType.Scheduled &&
                reservation.status == ReservationStatus.Pending) {
                
                activeReservations[count] = i;
                count++;
            }
        }
        
        // Check for conflicts with existing reservations
        for (uint256 i = 0; i < count; i++) {
            Reservation storage reservation = reservations[activeReservations[i]];
            
            // Convert duration from minutes to seconds for comparison
            uint256 durationInSeconds = duration * 60;
            uint256 existingDurationInSeconds = reservation.estimatedDuration * 60;
            
            // Check if new reservation overlaps with existing one
            if ((scheduledTime >= reservation.scheduledTime && 
                 scheduledTime < reservation.scheduledTime + existingDurationInSeconds) ||
                (scheduledTime + durationInSeconds > reservation.scheduledTime && 
                 scheduledTime + durationInSeconds <= reservation.scheduledTime + existingDurationInSeconds) ||
                (scheduledTime <= reservation.scheduledTime && 
                 scheduledTime + durationInSeconds >= reservation.scheduledTime + existingDurationInSeconds)) {
                
                return false; // Conflict found
            }
        }
        
        return true; // No conflicts
    }
    
    /**
     * @dev Get reservation details
     */
    function getReservation(uint256 reservationId) external view returns (Reservation memory) {
        require(reservations[reservationId].id == reservationId, "Reservation does not exist");
        return reservations[reservationId];
    }
    
    /**
     * @dev Get all reservations for a user
     */
    function getReservationsByUser(address user) external view returns (uint256[] memory) {
        return userReservations[user];
    }
    
    /**
     * @dev Get the current queue for a station
     */
    function getStationQueue(uint256 stationId) external view returns (uint256[] memory) {
        return stationQueues[stationId];
    }
    
    /**
     * @dev Get queue position for a reservation
     */
    function getQueuePosition(uint256 reservationId) external view returns (uint256) {
        require(reservations[reservationId].id == reservationId, "Reservation does not exist");
        
        uint256 stationId = reservations[reservationId].stationId;
        uint256[] memory queue = stationQueues[stationId];
        
        for (uint256 i = 0; i < queue.length; i++) {
            if (queue[i] == reservationId) {
                return i;
            }
        }
        
        revert("Reservation not in queue");
    }
    
    /**
     * @dev Get wait time for a queue position
     */
    function getEstimatedWaitTime(uint256 stationId, uint256 position) external view returns (uint256) {
        require(position < stationQueues[stationId].length, "Position exceeds queue length");
        
        uint256 waitTime = 0;
        
        // Sum durations of reservations ahead in queue
        for (uint256 i = 0; i < position; i++) {
            uint256 reservationId = stationQueues[stationId][i];
            waitTime += reservations[reservationId].estimatedDuration;
        }
        
        return waitTime;
    }
    
    /**
     * @dev Get all active reservations for multiple stations
     * Useful for the journey planner to check availability
     */
    function getActiveReservationsForStations(uint256[] calldata stationIds) external view returns (uint256[][] memory) {
        uint256[][] memory result = new uint256[][](stationIds.length);
        
        for (uint256 i = 0; i < stationIds.length; i++) {
            uint256[] memory stationQueue = stationQueues[stationIds[i]];
            result[i] = stationQueue;
        }
        
        return result;
    }
}