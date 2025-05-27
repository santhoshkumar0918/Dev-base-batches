// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ChargingStationManager is Ownable {
    uint256 private _stationIdCounter;

    struct ChargingStation {
        uint256 id;
        string name;
        string location;
        uint256 latitude;
        uint256 longitude;
        uint256 totalSlots;
        uint256 availableSlots;
        uint256 chargingSpeed; // in kW
        uint256 pricePerKwh; // in wei per kWh
        string[] amenities;
        bool isActive;
        address operator;
        uint256 createdAt;
    }

    struct ChargingSlot {
        uint256 stationId;
        uint256 slotNumber;
        bool isOccupied;
        address currentUser;
        uint256 startTime;
        uint256 estimatedEndTime;
    }

    mapping(uint256 => ChargingStation) public chargingStations;
    mapping(uint256 => mapping(uint256 => ChargingSlot)) public chargingSlots; // stationId => slotNumber => ChargingSlot
    mapping(uint256 => bool) public stationExists;

    event ChargingStationAdded(uint256 indexed stationId, string name, string location);
    event SlotOccupied(uint256 indexed stationId, uint256 indexed slotNumber, address indexed user);
    event SlotReleased(uint256 indexed stationId, uint256 indexed slotNumber);
    event AvailabilityUpdated(uint256 indexed stationId, uint256 availableSlots);

    constructor() Ownable(msg.sender) {
        _stationIdCounter = 0;
    }

    function addChargingStation(
        string memory _name,
        string memory _location,
        uint256 _latitude,
        uint256 _longitude,
        uint256 _totalSlots,
        uint256 _chargingSpeed,
        uint256 _pricePerKwh,
        string[] memory _amenities
    ) external onlyOwner {
        _stationIdCounter++;
        uint256 stationId = _stationIdCounter;

        chargingStations[stationId] = ChargingStation({
            id: stationId,
            name: _name,
            location: _location,
            latitude: _latitude,
            longitude: _longitude,
            totalSlots: _totalSlots,
            availableSlots: _totalSlots,
            chargingSpeed: _chargingSpeed,
            pricePerKwh: _pricePerKwh,
            amenities: _amenities,
            isActive: true,
            operator: msg.sender,
            createdAt: block.timestamp
        });

        // Initialize all slots as available
        for (uint256 i = 1; i <= _totalSlots; i++) {
            chargingSlots[stationId][i] = ChargingSlot({
                stationId: stationId,
                slotNumber: i,
                isOccupied: false,
                currentUser: address(0),
                startTime: 0,
                estimatedEndTime: 0
            });
        }

        stationExists[stationId] = true;
        emit ChargingStationAdded(stationId, _name, _location);
    }

    function occupySlot(
        uint256 _stationId,
        uint256 _slotNumber,
        uint256 _estimatedEndTime
    ) external {
        require(stationExists[_stationId], "Station does not exist");
        require(_slotNumber > 0 && _slotNumber <= chargingStations[_stationId].totalSlots, "Invalid slot number");
        require(!chargingSlots[_stationId][_slotNumber].isOccupied, "Slot is already occupied");

        chargingSlots[_stationId][_slotNumber].isOccupied = true;
        chargingSlots[_stationId][_slotNumber].currentUser = msg.sender;
        chargingSlots[_stationId][_slotNumber].startTime = block.timestamp;
        chargingSlots[_stationId][_slotNumber].estimatedEndTime = _estimatedEndTime;

        chargingStations[_stationId].availableSlots--;

        emit SlotOccupied(_stationId, _slotNumber, msg.sender);
        emit AvailabilityUpdated(_stationId, chargingStations[_stationId].availableSlots);
    }

    function releaseSlot(uint256 _stationId, uint256 _slotNumber) external {
        require(stationExists[_stationId], "Station does not exist");
        require(chargingSlots[_stationId][_slotNumber].isOccupied, "Slot is not occupied");
        require(
            chargingSlots[_stationId][_slotNumber].currentUser == msg.sender || 
            owner() == msg.sender,
            "Not authorized to release this slot"
        );

        chargingSlots[_stationId][_slotNumber].isOccupied = false;
        chargingSlots[_stationId][_slotNumber].currentUser = address(0);
        chargingSlots[_stationId][_slotNumber].startTime = 0;
        chargingSlots[_stationId][_slotNumber].estimatedEndTime = 0;

        chargingStations[_stationId].availableSlots++;

        emit SlotReleased(_stationId, _slotNumber);
        emit AvailabilityUpdated(_stationId, chargingStations[_stationId].availableSlots);
    }

    function getChargingStation(uint256 _stationId) external view returns (ChargingStation memory) {
        require(stationExists[_stationId], "Station does not exist");
        return chargingStations[_stationId];
    }

    function getAvailableSlots(uint256 _stationId) external view returns (uint256) {
        require(stationExists[_stationId], "Station does not exist");
        return chargingStations[_stationId].availableSlots;
    }

    function getAllChargingStations() external view returns (ChargingStation[] memory) {
        ChargingStation[] memory stations = new ChargingStation[](_stationIdCounter);
        for (uint256 i = 1; i <= _stationIdCounter; i++) {
            if (stationExists[i] && chargingStations[i].isActive) {
                stations[i-1] = chargingStations[i];
            }
        }
        return stations;
    }

    function updateStationAvailability(uint256 _stationId, bool _isActive) external onlyOwner {
        require(stationExists[_stationId], "Station does not exist");
        chargingStations[_stationId].isActive = _isActive;
    }

    function getCurrentStationId() external view returns (uint256) {
        return _stationIdCounter;
    }
}