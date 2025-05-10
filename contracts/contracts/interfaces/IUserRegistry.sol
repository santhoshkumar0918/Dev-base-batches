interface IUserRegistry {
    function registerUser(string memory name, string memory email) external;
    function updateUser(string memory name, string memory email) external;
    function getUserInfo(address userAddress) external view returns (Structs.User memory);
    function isRegistered(address userAddress) external view returns (bool);
    function updateReputation(address userAddress, uint256 reputationChange, bool isPositive) external;
}