import "./interfaces/IStationRegistry.sol";
import "./interfaces/IUserRegistry.sol";
import "./libraries/Structs.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StationRegistry is IStationRegistry, Ownable {
    IUserRegistry private userRegistry;
    
    uint256 private stationCounter = 0;
    mapping(uint256 => Structs.Station) private stations;
    mapping(address => uint256[]) private stationsByOwner;
    uint256[] private activeStationIds;
    
    event StationRegistered(uint256 indexed stationId, address indexed owner, string stationType);
    event ChargerAdded(uint256 indexed stationId, uint256 indexed chargerId, string chargerType, uint256 powerOutput);
    event ChargerStatusUpdated(uint256 indexed stationId, uint256 indexed chargerId, bool isAvailable);
    event StationStatusUpdated(uint256 indexed stationId, bool isActive);
    event StationReputationUpdated(uint256 indexed stationId, uint256 newReputation);
    
    constructor(address _userRegistryAddress) Ownable(msg.sender) {
        userRegistry = IUserRegistry(_userRegistryAddress);
    }
    
    modifier onlyRegisteredUser() {
        require(userRegistry.isRegistered(msg.sender), "StationRegistry: user not registered");
        _;
    }
    
    modifier onlyStationOwner(uint256 stationId) {
        require(stations[stationId].owner == msg.sender, "StationRegistry: not station owner");
        _;
    }
    
    function registerStation(
        string memory stationType,
        string memory name,
        string memory metadata
    ) external override onlyRegisteredUser returns (uint256) {
        stationCounter++;
        
        Structs.Station storage newStation = stations[stationCounter];
        newStation.id = stationCounter;
        newStation.owner = msg.sender;
        newStation.stationType = stationType;
        newStation.name = name;
        newStation.metadata = metadata;
        newStation.isActive = true;
        newStation.registrationTime = block.timestamp;
        newStation.reputation = 100; // Default reputation
        
        stationsByOwner[msg.sender].push(stationCounter);
        activeStationIds.push(stationCounter);
        
        emit StationRegistered(stationCounter, msg.sender, stationType);
        return stationCounter;
    }
    
    function addCharger(
        uint256 stationId,
        string memory chargerType,
        uint256 powerOutput,
        uint256 pricePerKWh
    ) external override onlyStationOwner(stationId) returns (uint256) {
        Structs.Station storage station = stations[stationId];
        
        uint256 chargerId = station.chargers.length + 1;
        
        Structs.Charger memory newCharger = Structs.Charger({
            id: chargerId,
            stationId: stationId,
            chargerType: chargerType,
            powerOutput: powerOutput,
            pricePerKWh: pricePerKWh,
            isAvailable: true
        });
        
        station.chargers.push(newCharger);
        
        emit ChargerAdded(stationId, chargerId, chargerType, powerOutput);
        return chargerId;
    }
    
    function updateChargerStatus(
        uint256 stationId,
        uint256 chargerId,
        bool isAvailable
    ) external override onlyStationOwner(stationId) {
        require(chargerId > 0 && chargerId <= stations[stationId].chargers.length, "StationRegistry: invalid charger ID");
        
        stations[stationId].chargers[chargerId - 1].isAvailable = isAvailable;
        
        emit ChargerStatusUpdated(stationId, chargerId, isAvailable);
    }
    
    function updateStationStatus(uint256 stationId, bool isActive) external override onlyStationOwner(stationId) {
        stations[stationId].isActive = isActive;
        
        // Update active stations list
        if (isActive) {
            bool found = false;
            for (uint256 i = 0; i < activeStationIds.length; i++) {
                if (activeStationIds[i] == stationId) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                activeStationIds.push(stationId);
            }
        } else {
            for (uint256 i = 0; i < activeStationIds.length; i++) {
                if (activeStationIds[i] == stationId) {
                    // Replace with the last element and remove the last element
                    activeStationIds[i] = activeStationIds[activeStationIds.length - 1];
                    activeStationIds.pop();
                    break;
                }
            }
        }
        
        emit StationStatusUpdated(stationId, isActive);
    }
    
    function getStation(uint256 stationId) external view override returns (Structs.Station memory) {
        require(stationId > 0 && stationId <= stationCounter, "StationRegistry: invalid station ID");
        return stations[stationId];
    }
    
    function getCharger(uint256 stationId, uint256 chargerId) external view override returns (Structs.Charger memory) {
        require(stationId > 0 && stationId <= stationCounter, "StationRegistry: invalid station ID");
        require(chargerId > 0 && chargerId <= stations[stationId].chargers.length, "StationRegistry: invalid charger ID");
        
        return stations[stationId].chargers[chargerId - 1];
    }
    
    function getStationsByOwner(address owner) external view override returns (uint256[] memory) {
        return stationsByOwner[owner];
    }
    
    function getActiveStations() external view override returns (uint256[] memory) {
        return activeStationIds;
    }
    
    function updateStationReputation(uint256 stationId, uint256 reputationChange, bool isPositive) external override {
        require(msg.sender == owner() || msg.sender == address(this), "StationRegistry: not authorized");
        require(stationId > 0 && stationId <= stationCounter, "StationRegistry: invalid station ID");
        
        if (isPositive) {
            stations[stationId].reputation += reputationChange;
        } else {
            // Ensure reputation doesn't go below zero
            if (stations[stationId].reputation < reputationChange) {
                stations[stationId].reputation = 0;
            } else {
                stations[stationId].reputation -= reputationChange;
            }
        }
        
        emit StationReputationUpdated(stationId, stations[stationId].reputation);
    }
    
    function getChargersCount(uint256 stationId) external view returns (uint256) {
        require(stationId > 0 && stationId <= stationCounter, "StationRegistry: invalid station ID");
        return stations[stationId].chargers.length;
    }
}
