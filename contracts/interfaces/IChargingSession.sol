// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IChargingSession {
    function startSession(uint256 stationId, uint256 chargerId) external;
    function endSession(uint256 sessionId, uint256 energyConsumed) external;
    function payForSession(uint256 sessionId) external payable;
    function getSessionById(uint256 sessionId) external view returns (Structs.ChargingSession memory);
    function getActiveSession(address user) external view returns (uint256);
    function getUserSessions(address user) external view returns (uint256[] memory);
    function getStationSessions(uint256 stationId) external view returns (uint256[] memory);
}