// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IBooking.sol";
import "./interfaces/IStationRegistry.sol";
import "./interfaces/IUserRegistry.sol";
import "./interfaces/IEVToken.sol";
import "./libraries/Structs.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookingSystem is IBooking, Ownable {
    IStationRegistry private stationRegistry;
    IUserRegistry private userRegistry;
    IEVToken private evToken;
    
    uint256 private bookingCounter = 0;
    mapping(uint256 => Structs.Booking) private bookings;
    mapping(address => uint256[]) private userBookings;
    mapping(uint256 => uint256[]) private stationBookings;
    mapping(address => uint256) private activeUserBookings; // user address => active booking ID
    
    // Queue management
    mapping(uint256 => Structs.QueueEntry[]) private stationQueues; // stationId => queue entries
    mapping(uint256 => mapping(address => uint256)) private queuePositions; // stationId => user address => position (1-based, 0 if not in queue)
    
    // Constants
    uint256 private constant MAX_BOOKING_DURATION = 120; // Max booking duration in minutes
    uint256 private constant MAX_ADVANCE_BOOKING_DAYS = 7; // Max days in advance for booking
    uint256 private constant BOOKING_DEPOSIT = 10; // Deposit in EV tokens
    uint256 private constant QUEUE_REWARD_BASE = 50; // Base reward for accepting alternative station
    uint256 private constant WAIT_REWARD_RATE = 10; // Tokens per 30 minutes of waiting
    
    event BookingCreated(uint256 indexed bookingId, address indexed user, uint256 indexed stationId, uint256 chargerId, uint256 startTime);
    event BookingCancelled(uint256 indexed bookingId);
    event BookingCompleted(uint256 indexed bookingId);
    event AddedToQueue(uint256 indexed stationId, address indexed user, uint256 position, uint256 estimatedDuration);
    event RemovedFromQueue(uint256 indexed stationId, address indexed user);
    event RewardIssued(address indexed user, uint256 amount, string reason);
    
    constructor(
        address _stationRegistryAddress,
        address _userRegistryAddress,
        address _evTokenAddress
    ) Ownable(msg.sender) {
        stationRegistry = IStationRegistry(_stationRegistryAddress);
        userRegistry = IUserRegistry(_userRegistryAddress);
        evToken = IEVToken(_evTokenAddress);
    }
    
    modifier onlyRegisteredUser() {
        require(userRegistry.isRegistered(msg.sender), "BookingSystem: user not registered");
        _;
    }
    
    modifier onlyBookingUser(uint256 bookingId) {
        require(bookings[bookingId].user == msg.sender, "BookingSystem: not booking user");
        _;
    }
    
    function createBooking(
        uint256 stationId,
        uint256 chargerId,
        uint256 startTime,
        uint256 estimatedDuration
    ) external override onlyRegisteredUser returns (uint256) {
        // Validate inputs
        require(startTime > block.timestamp, "BookingSystem: start time must be in the future");
        require(startTime <= block.timestamp + (MAX_ADVANCE_BOOKING_DAYS * 1 days), "BookingSystem: booking too far in advance");
        require(estimatedDuration > 0 && estimatedDuration <= MAX_BOOKING_DURATION, "BookingSystem: invalid duration");
        
        // Validate station and charger
        Structs.Station memory station = stationRegistry.getStation(stationId);
        require(station.isActive, "BookingSystem: station not active");
        
        Structs.Charger memory charger = stationRegistry.getCharger(stationId, chargerId);
        
        // Check if user already has an active booking
        require(activeUserBookings[msg.sender] == 0, "BookingSystem: user already has active booking");
        
        // Check if time slot is available
        uint256 endTime = startTime + (estimatedDuration * 1 minutes);
        require(isTimeSlotAvailable(stationId, chargerId, startTime, endTime), "BookingSystem: time slot not available");
        
        // Collect booking deposit
        require(evToken.transferFrom(msg.sender, address(this), BOOKING_DEPOSIT), "BookingSystem: failed to collect deposit");
        
        // Create new booking
        bookingCounter++;
        
        Structs.Booking storage newBooking = bookings[bookingCounter];
        newBooking.id = bookingCounter;
        newBooking.user = msg.sender;
        newBooking.stationId = stationId;
        newBooking.chargerId = chargerId;
        newBooking.startTime = startTime;
        newBooking.endTime = endTime;
        newBooking.estimatedDuration = estimatedDuration;
        newBooking.isActive = true;
        newBooking.isCompleted = false;
        
        // Update mappings
        userBookings[msg.sender].push(bookingCounter);
        stationBookings[stationId].push(bookingCounter);
        activeUserBookings[msg.sender] = bookingCounter;
        
        emit BookingCreated(bookingCounter, msg.sender, stationId, chargerId, startTime);
        return bookingCounter;
    }
    
    function cancelBooking(uint256 bookingId) external override onlyBookingUser(bookingId) {
        Structs.Booking storage booking = bookings[bookingId];
        
        require(booking.isActive, "BookingSystem: booking not active");
        require(!booking.isCompleted, "BookingSystem: booking already completed");
        
        // Check if cancellation is close to start time (less than 1 hour)
        bool isLateCancellation = booking.startTime - block.timestamp < 1 hours;
        
        // Update booking status
        booking.isActive = false;
        
        // Update active booking mapping
        if (activeUserBookings[msg.sender] == bookingId) {
            activeUserBookings[msg.sender] = 0;
        }
        
        // Return deposit (full or partial depending on cancellation time)
        uint256 refundAmount = isLateCancellation ? BOOKING_DEPOSIT / 2 : BOOKING_DEPOSIT;
        evToken.transfer(msg.sender, refundAmount);
        
        emit BookingCancelled(bookingId);
    }
    
    function completeBooking(uint256 bookingId) external override onlyBookingUser(bookingId) {
        Structs.Booking storage booking = bookings[bookingId];
        
        require(booking.isActive, "BookingSystem: booking not active");
        require(!booking.isCompleted, "BookingSystem: booking already completed");
        
        // Mark booking as completed
        booking.isCompleted = true;
        booking.isActive = false;
        
        // Update active booking mapping
        if (activeUserBookings[msg.sender] == bookingId) {
            activeUserBookings[msg.sender] = 0;
        }
        
        // Return deposit
        evToken.transfer(msg.sender, BOOKING_DEPOSIT);
        
        // Issue reward for using booking system
        uint256 rewardAmount = 5; // Base reward for using booking system
        evToken.mint(msg.sender, rewardAmount);
        
        emit BookingCompleted(bookingId);
        emit RewardIssued(msg.sender, rewardAmount, "Booking completed");
    }
    
    function getBookingById(uint256 bookingId) external view override returns (Structs.Booking memory) {
        require(bookingId > 0 && bookingId <= bookingCounter, "BookingSystem: invalid booking ID");
        return bookings[bookingId];
    }
    
    function getUserBookings(address user) external view override returns (uint256[] memory) {
        return userBookings[user];
    }
    
    function getStationBookings(uint256 stationId) external view override returns (uint256[] memory) {
        return stationBookings[stationId];
    }
    
    function getActiveBooking(address user) external view override returns (uint256) {
        return activeUserBookings[user];
    }
    
    function isTimeSlotAvailable(
        uint256 stationId,
        uint256 chargerId,
        uint256 startTime,
        uint256 endTime
    ) public view override returns (bool) {
        // Check all bookings for this station
        uint256[] memory sBookings = stationBookings[stationId];
        
        for (uint256 i = 0; i < sBookings.length; i++) {
            Structs.Booking memory booking = bookings[sBookings[i]];
            
            // Only check active bookings for the same charger
            if (booking.isActive && booking.chargerId == chargerId) {
                // Check if there's an overlap
                if (!(endTime <= booking.startTime || startTime >= booking.endTime)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Queue management functions
    
    function addToQueue(uint256 stationId, uint256 estimatedDuration) external override onlyRegisteredUser {
        // Validate station
        Structs.Station memory station = stationRegistry.getStation(stationId);
        require(station.isActive, "BookingSystem: station not active");
        require(estimatedDuration > 0 && estimatedDuration <= MAX_BOOKING_DURATION, "BookingSystem: invalid duration");
        
        // Check if user is already in queue
        require(queuePositions[stationId][msg.sender] == 0, "BookingSystem: already in queue");
        
        // Add to queue
        Structs.QueueEntry memory entry = Structs.QueueEntry({
            user: msg.sender,
            estimatedDuration: estimatedDuration,
            joinTime: block.timestamp,
            isActive: true
        });
        
        stationQueues[stationId].push(entry);
        
        // Position is 1-based
        uint256 position = stationQueues[stationId].length;
        queuePositions[stationId][msg.sender] = position;
        
        emit AddedToQueue(stationId, msg.sender, position, estimatedDuration);
    }
    
    function removeFromQueue(uint256 stationId) external override {
        uint256 position = queuePositions[stationId][msg.sender];
        require(position > 0, "BookingSystem: not in queue");
        
        // Mark entry as inactive
        stationQueues[stationId][position - 1].isActive = false;
        
        // Remove from position mapping
        queuePositions[stationId][msg.sender] = 0;
        
        emit RemovedFromQueue(stationId, msg.sender);
    }
    
    function getQueuePosition(uint256 stationId, address user) external view override returns (uint256) {
        // Get raw position (1-based, 0 if not in queue)
        uint256 rawPosition = queuePositions[stationId][user];
        if (rawPosition == 0) {
            return 0;
        }
        
        // Count active entries before this user
        uint256 activePosition = 0;
        for (uint256 i = 0; i < rawPosition; i++) {
            if (stationQueues[stationId][i].isActive) {
                activePosition++;
            }
        }
        
        return activePosition;
    }
    
    function getQueueLength(uint256 stationId) external view override returns (uint256) {
        uint256 activeCount = 0;
        Structs.QueueEntry[] memory queue = stationQueues[stationId];
        
        for (uint256 i = 0; i < queue.length; i++) {
            if (queue[i].isActive) {
                activeCount++;
            }
        }
        
        return activeCount;
    }
    
    // Reward functions
    
    function issueQueueWaitingReward(address user, uint256 waitingTime) external onlyOwner {
        // Reward based on waiting time (in minutes)
        uint256 rewardAmount = (waitingTime / 30) * WAIT_REWARD_RATE;
        
        if (rewardAmount > 0) {
            evToken.mint(user, rewardAmount);
            emit RewardIssued(user, rewardAmount, "Queue waiting");
        }
    }
    
    function issueAlternativeStationReward(address user, uint256 detourDistance) external onlyOwner {
        // Base reward plus additional based on detour distance (in km)
        uint256 rewardAmount = QUEUE_REWARD_BASE + (detourDistance * 10);
        
        evToken.mint(user, rewardAmount);
        emit RewardIssued(user, rewardAmount, "Alternative station");
    }
}