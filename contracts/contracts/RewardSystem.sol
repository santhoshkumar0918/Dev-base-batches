// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IEVToken.sol";
import "./interfaces/IUserRegistry.sol";
import "./interfaces/IStationRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardSystem is Ownable {
    IEVToken private evToken;
    IUserRegistry private userRegistry;
    IStationRegistry private stationRegistry;
    
    // Reward constants
    uint256 public newStationReward = 500; // Tokens for adding a new station
    uint256 public feedbackReward = 10; // Tokens for providing feedback
    uint256 public referralReward = 100; // Tokens for referring a new user
    uint256 public maintenanceReward = 50; // Tokens for reporting maintenance issues
    
    // Mapping to track rewards claimed
    mapping(address => mapping(string => bool)) private hasClaimedReward;
    mapping(address => uint256) private lastFeedbackTime;
    mapping(address => address[]) private referrals;
    
    // Events
    event RewardIssued(address indexed user, uint256 amount, string rewardType);
    event RewardConfigUpdated(string rewardType, uint256 newAmount);
    
    constructor(
        address _evTokenAddress,
        address _userRegistryAddress,
        address _stationRegistryAddress
    ) Ownable(msg.sender) {
        evToken = IEVToken(_evTokenAddress);
        userRegistry = IUserRegistry(_userRegistryAddress);
        stationRegistry = IStationRegistry(_stationRegistryAddress);
    }
    
    modifier onlyRegisteredUser() {
        require(userRegistry.isRegistered(msg.sender), "RewardSystem: user not registered");
        _;
    }
    
    // Function to claim reward for adding a new station
    function claimNewStationReward(uint256 stationId) external onlyRegisteredUser {
        // Check if the station exists and is owned by the caller
        Structs.Station memory station = stationRegistry.getStation(stationId);
        require(station.owner == msg.sender, "RewardSystem: not station owner");
        
        // Generate a unique reward ID
        string memory rewardId = string(abi.encodePacked("station_", uint2str(stationId)));
        
        // Check if reward has already been claimed
        require(!hasClaimedReward[msg.sender][rewardId], "RewardSystem: reward already claimed");
        
        // Mark reward as claimed
        hasClaimedReward[msg.sender][rewardId] = true;
        
        // Issue reward
        evToken.mint(msg.sender, newStationReward);
        
        emit RewardIssued(msg.sender, newStationReward, "new_station");
    }
    
    // Function to claim reward for providing feedback
    function claimFeedbackReward(uint256 stationId, string calldata feedbackHash) external onlyRegisteredUser {
        // Ensure minimum time between feedback rewards
        require(block.timestamp >= lastFeedbackTime[msg.sender] + 1 days, "RewardSystem: feedback rate limited");
        
        // Generate a unique reward ID
        string memory rewardId = string(abi.encodePacked("feedback_", uint2str(stationId), "_", feedbackHash));
        
        // Check if reward has already been claimed
        require(!hasClaimedReward[msg.sender][rewardId], "RewardSystem: reward already claimed");
        
        // Mark reward as claimed
        hasClaimedReward[msg.sender][rewardId] = true;
        lastFeedbackTime[msg.sender] = block.timestamp;
        
        // Issue reward
        evToken.mint(msg.sender, feedbackReward);
        
        emit RewardIssued(msg.sender, feedbackReward, "feedback");
    }
    
    // Function to refer a new user
    function referUser(address newUser) external onlyRegisteredUser {
        // Ensure the referred user is not already registered
        require(!userRegistry.isRegistered(newUser), "RewardSystem: user already registered");
        
        // Add to referrals list
        referrals[msg.sender].push(newUser);
    }
    
    // Function for a new user to claim their referrer's reward
    function claimReferralReward(address referrer) external onlyRegisteredUser {
        // Check if caller was referred by the referrer
        bool wasReferred = false;
        address[] memory referredUsers = referrals[referrer];
        
        for (uint256 i = 0; i < referredUsers.length; i++) {
            if (referredUsers[i] == msg.sender) {
                wasReferred = true;
                break;
            }
        }
        
        require(wasReferred, "RewardSystem: not referred by specified user");
        
        // Generate a unique reward ID
        string memory rewardId = string(abi.encodePacked("referral_", addressToString(msg.sender)));
        
        // Check if reward has already been claimed
        require(!hasClaimedReward[referrer][rewardId], "RewardSystem: reward already claimed");
        
        // Mark reward as claimed
        hasClaimedReward[referrer][rewardId] = true;
        
        // Issue reward to referrer
        evToken.mint(referrer, referralReward);
        
        // Issue a smaller reward to the new user
        evToken.mint(msg.sender, referralReward / 2);
        
        emit RewardIssued(referrer, referralReward, "referrer");
        emit RewardIssued(msg.sender, referralReward / 2, "referred");
    }
    
    // Function to reward maintenance reports
    function claimMaintenanceReward(uint256 stationId, string calldata issueHash) external onlyRegisteredUser {
        // Generate a unique reward ID
        string memory rewardId = string(abi.encodePacked("maintenance_", uint2str(stationId), "_", issueHash));
        
        // Check if reward has already been claimed
        require(!hasClaimedReward[msg.sender][rewardId], "RewardSystem: reward already claimed");
        
        // Mark reward as claimed
        hasClaimedReward[msg.sender][rewardId] = true;
        
        // Issue reward
        evToken.mint(msg.sender, maintenanceReward);
        
        emit RewardIssued(msg.sender, maintenanceReward, "maintenance");
    }
    
    // Function to reward users for accepting alternative stations
    function rewardAlternativeStation(address user, uint256 detourDistance) external onlyOwner {
        // Base reward plus additional based on detour distance (in km)
        uint256 rewardAmount = 50 + (detourDistance * 10);
        
        // Issue reward
        evToken.mint(user, rewardAmount);
        
        emit RewardIssued(user, rewardAmount, "alternative_station");
    }
    
    // Function to reward users for waiting in queue
    function rewardQueueWaiting(address user, uint256 waitingTime) external onlyOwner {
        // Reward based on waiting time (in minutes)
        uint256 rewardAmount = (waitingTime / 30) * 10;
        
        // Issue reward
        evToken.mint(user, rewardAmount);
        
        emit RewardIssued(user, rewardAmount, "queue_waiting");
    }
    
    // Administrative functions
    
    function setNewStationReward(uint256 amount) external onlyOwner {
        newStationReward = amount;
        emit RewardConfigUpdated("new_station", amount);
    }
    
    function setFeedbackReward(uint256 amount) external onlyOwner {
        feedbackReward = amount;
        emit RewardConfigUpdated("feedback", amount);
    }
    
    function setReferralReward(uint256 amount) external onlyOwner {
        referralReward = amount;
        emit RewardConfigUpdated("referral", amount);
    }
    
    function setMaintenanceReward(uint256 amount) external onlyOwner {
        maintenanceReward = amount;
        emit RewardConfigUpdated("maintenance", amount);
    }
    
    // Utility functions
    
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        
        uint256 j = _i;
        uint256 length;
        
        while (j != 0) {
            length++;
            j /= 10;
        }
        
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        
        return string(bstr);
    }
    
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        
        return string(str);
    }
}