import "./interfaces/IUserRegistry.sol";
import "./libraries/Structs.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UserRegistry is IUserRegistry, Ownable {
    mapping(address => Structs.User) private users;
    address[] private registeredUsers;
    
    event UserRegistered(address indexed userAddress, string name);
    event UserUpdated(address indexed userAddress, string name);
    event ReputationUpdated(address indexed userAddress, uint256 newReputation);
    
    constructor() Ownable(msg.sender) {}
    
    function registerUser(string memory name, string memory email) external override {
        require(!users[msg.sender].isRegistered, "UserRegistry: user already registered");
        
        users[msg.sender] = Structs.User({
            walletAddress: msg.sender,
            name: name,
            email: email,
            isRegistered: true,
            registrationTime: block.timestamp,
            tokenBalance: 0,
            reputation: 100 // Default reputation
        });
        
        registeredUsers.push(msg.sender);
        emit UserRegistered(msg.sender, name);
    }
    
    function updateUser(string memory name, string memory email) external override {
        require(users[msg.sender].isRegistered, "UserRegistry: user not registered");
        
        users[msg.sender].name = name;
        users[msg.sender].email = email;
        
        emit UserUpdated(msg.sender, name);
    }
    
    function getUserInfo(address userAddress) external view override returns (Structs.User memory) {
        return users[userAddress];
    }
    
    function isRegistered(address userAddress) external view override returns (bool) {
        return users[userAddress].isRegistered;
    }
    
    function updateReputation(address userAddress, uint256 reputationChange, bool isPositive) external override {
        require(msg.sender == owner() || msg.sender == address(this), "UserRegistry: not authorized");
        require(users[userAddress].isRegistered, "UserRegistry: user not registered");
        
        if (isPositive) {
            users[userAddress].reputation += reputationChange;
        } else {
            // Ensure reputation doesn't go below zero
            if (users[userAddress].reputation < reputationChange) {
                users[userAddress].reputation = 0;
            } else {
                users[userAddress].reputation -= reputationChange;
            }
        }
        
        emit ReputationUpdated(userAddress, users[userAddress].reputation);
    }
    
    function getTotalUsers() external view returns (uint256) {
        return registeredUsers.length;
    }
    
    function getUserByIndex(uint256 index) external view returns (address) {
        require(index < registeredUsers.length, "UserRegistry: index out of bounds");
        return registeredUsers[index];
    }
}