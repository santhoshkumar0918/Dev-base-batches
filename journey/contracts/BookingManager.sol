// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ChargingStationManager.sol";

contract BookingManager is ReentrancyGuard {
    uint256 private _bookingIdCounter;

    ChargingStationManager public chargingStationManager;

    struct Booking {
        uint256 id;
        address user;
        uint256 stationId;
        uint256 slotNumber;
        uint256 journeyId;
        uint256 scheduledStartTime;
        uint256 scheduledEndTime;
        uint256 estimatedChargingDuration;
        uint256 bookedAt;
        BookingStatus status;
        uint256 actualStartTime;
        uint256 actualEndTime;
        uint256 totalCost;
        bool isPaid;
    }

    enum BookingStatus { BOOKED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW }

    mapping(uint256 => Booking) public bookings;
    mapping(address => uint256[]) public userBookings;
    mapping(uint256 => mapping(uint256 => uint256)) public stationSlotBookings; // stationId => slotNumber => bookingId
    mapping(uint256 => uint256[]) public journeyBookings; // journeyId => bookingIds

    event BookingCreated(uint256 indexed bookingId, address indexed user, uint256 indexed stationId);
    event BookingConfirmed(uint256 indexed bookingId);
    event BookingStarted(uint256 indexed bookingId);
    event BookingCompleted(uint256 indexed bookingId, uint256 totalCost);
    event BookingCancelled(uint256 indexed bookingId);
    event PaymentReceived(uint256 indexed bookingId, uint256 amount);

    constructor(address _chargingStationManager) {
        chargingStationManager = ChargingStationManager(_chargingStationManager);
        _bookingIdCounter = 0;
    }

    function createBooking(
        uint256 _stationId,
        uint256 _slotNumber,
        uint256 _journeyId,
        uint256 _scheduledStartTime,
        uint256 _estimatedChargingDuration
    ) external {
        ChargingStationManager.ChargingStation memory station = 
            chargingStationManager.getChargingStation(_stationId);
        
        require(station.isActive, "Station is not active");
        require(_slotNumber > 0 && _slotNumber <= station.totalSlots, "Invalid slot number");
        require(stationSlotBookings[_stationId][_slotNumber] == 0, "Slot already booked for this time");
        require(_scheduledStartTime > block.timestamp, "Cannot book in the past");

        _bookingIdCounter++;
        uint256 bookingId = _bookingIdCounter;

        uint256 scheduledEndTime = _scheduledStartTime + _estimatedChargingDuration;

        bookings[bookingId] = Booking({
            id: bookingId,
            user: msg.sender,
            stationId: _stationId,
            slotNumber: _slotNumber,
            journeyId: _journeyId,
            scheduledStartTime: _scheduledStartTime,
            scheduledEndTime: scheduledEndTime,
            estimatedChargingDuration: _estimatedChargingDuration,
            bookedAt: block.timestamp,
            status: BookingStatus.BOOKED,
            actualStartTime: 0,
            actualEndTime: 0,
            totalCost: 0,
            isPaid: false
        });

        stationSlotBookings[_stationId][_slotNumber] = bookingId;
        userBookings[msg.sender].push(bookingId);
        journeyBookings[_journeyId].push(bookingId);

        emit BookingCreated(bookingId, msg.sender, _stationId);
    }

    function confirmBooking(uint256 _bookingId) external {
        require(bookings[_bookingId].user == msg.sender, "Not your booking");
        require(bookings[_bookingId].status == BookingStatus.BOOKED, "Booking cannot be confirmed");

        bookings[_bookingId].status = BookingStatus.CONFIRMED;
        emit BookingConfirmed(_bookingId);
    }

    function startCharging(uint256 _bookingId) external nonReentrant {
        require(bookings[_bookingId].user == msg.sender, "Not your booking");
        require(bookings[_bookingId].status == BookingStatus.CONFIRMED, "Booking not confirmed");
        require(
            block.timestamp >= bookings[_bookingId].scheduledStartTime - 300, // 5 minutes early allowed
            "Too early to start charging"
        );

        bookings[_bookingId].status = BookingStatus.IN_PROGRESS;
        bookings[_bookingId].actualStartTime = block.timestamp;

        // Occupy the actual charging slot
        chargingStationManager.occupySlot(
            bookings[_bookingId].stationId,
            bookings[_bookingId].slotNumber,
            bookings[_bookingId].scheduledEndTime
        );

        emit BookingStarted(_bookingId);
    }

    function completeCharging(uint256 _bookingId, uint256 _energyConsumed) external payable nonReentrant {
        require(bookings[_bookingId].user == msg.sender, "Not your booking");
        require(bookings[_bookingId].status == BookingStatus.IN_PROGRESS, "Charging not in progress");

        bookings[_bookingId].actualEndTime = block.timestamp;
        bookings[_bookingId].status = BookingStatus.COMPLETED;

        // Calculate cost based on energy consumed
        ChargingStationManager.ChargingStation memory station = 
            chargingStationManager.getChargingStation(bookings[_bookingId].stationId);
        
        uint256 totalCost = _energyConsumed * station.pricePerKwh;
        bookings[_bookingId].totalCost = totalCost;

        require(msg.value >= totalCost, "Insufficient payment");

        bookings[_bookingId].isPaid = true;

        // Release the charging slot
        chargingStationManager.releaseSlot(
            bookings[_bookingId].stationId,
            bookings[_bookingId].slotNumber
        );

        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit BookingCompleted(_bookingId, totalCost);
        emit PaymentReceived(_bookingId, totalCost);
    }

    function cancelBooking(uint256 _bookingId) external {
        require(bookings[_bookingId].user == msg.sender, "Not your booking");
        require(
            bookings[_bookingId].status == BookingStatus.BOOKED || 
            bookings[_bookingId].status == BookingStatus.CONFIRMED,
            "Cannot cancel booking in current status"
        );

        bookings[_bookingId].status = BookingStatus.CANCELLED;
        
        // Remove slot booking
        stationSlotBookings[bookings[_bookingId].stationId][bookings[_bookingId].slotNumber] = 0;

        emit BookingCancelled(_bookingId);
    }

    function getBooking(uint256 _bookingId) external view returns (Booking memory) {
        return bookings[_bookingId];
    }

    function getUserBookings(address _user) external view returns (uint256[] memory) {
        return userBookings[_user];
    }

    function getJourneyBookings(uint256 _journeyId) external view returns (uint256[] memory) {
        return journeyBookings[_journeyId];
    }

    function isSlotAvailable(
        uint256 _stationId,
        uint256 _slotNumber,
        uint256 _startTime,
        uint256 _endTime
    ) external view returns (bool) {
        uint256 existingBookingId = stationSlotBookings[_stationId][_slotNumber];
        
        if (existingBookingId == 0) {
            return true;
        }

        Booking memory existingBooking = bookings[existingBookingId];
        
        // Check if there's a time conflict
        if (existingBooking.status == BookingStatus.CANCELLED || 
            existingBooking.status == BookingStatus.COMPLETED) {
            return true;
        }

        return (_endTime <= existingBooking.scheduledStartTime || 
                _startTime >= existingBooking.scheduledEndTime);
    }

    function getCurrentBookingId() external view returns (uint256) {
        return _bookingIdCounter;
    }
}