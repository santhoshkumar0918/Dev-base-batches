interface IBooking {
    function createBooking(
        uint256 stationId,
        uint256 chargerId,
        uint256 startTime,
        uint256 estimatedDuration
    ) external returns (uint256);
    
    function cancelBooking(uint256 bookingId) external;
    function completeBooking(uint256 bookingId) external;
    function getBookingById(uint256 bookingId) external view returns (Structs.Booking memory);
    function getUserBookings(address user) external view returns (uint256[] memory);
    function getStationBookings(uint256 stationId) external view returns (uint256[] memory);
    function getActiveBooking(address user) external view returns (uint256);
    function isTimeSlotAvailable(uint256 stationId, uint256 chargerId, uint256 startTime, uint256 endTime) external view returns (bool);
    function addToQueue(uint256 stationId, uint256 estimatedDuration) external;
    function removeFromQueue(uint256 stationId) external;
    function getQueuePosition(uint256 stationId, address user) external view returns (uint256);
    function getQueueLength(uint256 stationId) external view returns (uint256);
}