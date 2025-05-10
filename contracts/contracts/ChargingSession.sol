import "./interfaces/IChargingSession.sol";
import "./interfaces/IStationRegistry.sol";
import "./interfaces/IUserRegistry.sol";
import "./interfaces/IEVToken.sol";
import "./libraries/Structs.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChargingSession is IChargingSession, Ownable {
    IStationRegistry private stationRegistry;
    IUserRegistry private userRegistry;
    IEVToken private evToken;
    
    uint256 private sessionCounter = 0;
    mapping(uint256 => Structs.ChargingSession) private sessions;
    mapping(address => uint256[]) private userSessions;
    mapping(uint256 => uint256[]) private stationSessions;
    mapping(address => uint256) private activeUserSessions; // user address => active session ID
    mapping(uint256 => mapping(uint256 => bool)) private chargerInUse; // stationId => chargerId => in use?
    
    uint256 private platformFeePercentage = 3; // 3% platform fee
    
    event SessionStarted(uint256 indexed sessionId, address indexed user, uint256 indexed stationId, uint256 chargerId);
    event SessionEnded(uint256 indexed sessionId, uint256 energyConsumed);
    event SessionPaid(uint256 indexed sessionId, uint256 amount);
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
        require(userRegistry.isRegistered(msg.sender), "ChargingSession: user not registered");
        _;
    }
    
    modifier onlySessionUser(uint256 sessionId) {
        require(sessions[sessionId].user == msg.sender, "ChargingSession: not session user");
        _;
    }
    
    function startSession(uint256 stationId, uint256 chargerId) external override onlyRegisteredUser {
        // Validate station and charger
        Structs.Station memory station = stationRegistry.getStation(stationId);
        require(station.isActive, "ChargingSession: station not active");
        
        Structs.Charger memory charger = stationRegistry.getCharger(stationId, chargerId);
        require(charger.isAvailable, "ChargingSession: charger not available");
        
        // Check if user already has an active session
        require(activeUserSessions[msg.sender] == 0, "ChargingSession: user already has active session");
        
        // Check if charger is already in use
        require(!chargerInUse[stationId][chargerId], "ChargingSession: charger already in use");
        
        // Create new session
        sessionCounter++;
        
        Structs.ChargingSession storage newSession = sessions[sessionCounter];
        newSession.id = sessionCounter;
        newSession.user = msg.sender;
        newSession.stationId = stationId;
        newSession.chargerId = chargerId;
        newSession.startTime = block.timestamp;
        newSession.isActive = true;
        newSession.isCompleted = false;
        newSession.isPaid = false;
        
        // Update mappings
        userSessions[msg.sender].push(sessionCounter);
        stationSessions[stationId].push(sessionCounter);
        activeUserSessions[msg.sender] = sessionCounter;
        chargerInUse[stationId][chargerId] = true;
        
        // Update charger availability
        stationRegistry.updateChargerStatus(stationId, chargerId, false);
        
        emit SessionStarted(sessionCounter, msg.sender, stationId, chargerId);
    }
    
    function endSession(uint256 sessionId, uint256 energyConsumed) external override onlySessionUser(sessionId) {
        Structs.ChargingSession storage session = sessions[sessionId];
        
        require(session.isActive, "ChargingSession: session not active");
        
        // Calculate session data
        session.endTime = block.timestamp;
        session.energyConsumed = energyConsumed;
        
        // Get price per kWh from charger
        Structs.Charger memory charger = stationRegistry.getCharger(session.stationId, session.chargerId);
        
        // Calculate total cost (energyConsumed is in Wh, price is per kWh)
        uint256 energyInKWh = energyConsumed / 1000;
        session.totalCost = energyInKWh * charger.pricePerKWh;
        
        // Update session status
        session.isActive = false;
        session.isCompleted = true;
        
        // Update mappings
        activeUserSessions[msg.sender] = 0;
        chargerInUse[session.stationId][session.chargerId] = false;
        
        // Update charger availability
        stationRegistry.updateChargerStatus(session.stationId, session.chargerId, true);
        
        // Issue reward tokens for using the platform
        uint256 rewardAmount = calculateReward(energyConsumed);
        if (rewardAmount > 0) {
            evToken.mint(msg.sender, rewardAmount);
            emit RewardIssued(msg.sender, rewardAmount, "Session completed");
        }
        
        emit SessionEnded(sessionId, energyConsumed);
    }
    
    function payForSession(uint256 sessionId) external payable override onlySessionUser(sessionId) {
        Structs.ChargingSession storage session = sessions[sessionId];
        
        require(session.isCompleted, "ChargingSession: session not completed");
        require(!session.isPaid, "ChargingSession: session already paid");
        require(msg.value >= session.totalCost, "ChargingSession: insufficient payment");
        
        // Mark session as paid
        session.isPaid = true;
        
        // Calculate platform fee
        uint256 platformFee = (session.totalCost * platformFeePercentage) / 100;
        uint256 stationOwnerAmount = session.totalCost - platformFee;
        
        // Get station owner
        Structs.Station memory station = stationRegistry.getStation(session.stationId);
        
        // Transfer funds to station owner
        payable(station.owner).transfer(stationOwnerAmount);
        
        // Refund excess payment if any
        uint256 refundAmount = msg.value - session.totalCost;
        if (refundAmount > 0) {
            payable(msg.sender).transfer(refundAmount);
        }
        
        emit SessionPaid(sessionId, session.totalCost);
    }
    
    function getSessionById(uint256 sessionId) external view override returns (Structs.ChargingSession memory) {
        require(sessionId > 0 && sessionId <= sessionCounter, "ChargingSession: invalid session ID");
        return sessions[sessionId];
    }
    
    function getActiveSession(address user) external view override returns (uint256) {
        return activeUserSessions[user];
    }
    
    function getUserSessions(address user) external view override returns (uint256[] memory) {
        return userSessions[user];
    }
    
    function getStationSessions(uint256 stationId) external view override returns (uint256[] memory) {
        return stationSessions[stationId];
    }
    
    function calculateReward(uint256 energyConsumed) internal pure returns (uint256) {
        // Base reward: 1 token per kWh, with minimum of 5 tokens
        uint256 baseReward = (energyConsumed / 1000) * 1;
        return baseReward < 5 ? 5 : baseReward;
    }
    
    function setPlatformFeePercentage(uint256 _platformFeePercentage) external onlyOwner {
        require(_platformFeePercentage <= 10, "ChargingSession: fee too high");
        platformFeePercentage = _platformFeePercentage;
    }
}