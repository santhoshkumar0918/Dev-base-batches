// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenRewards
 * @dev ERC20 token for DEV rewards system
 */
contract TokenRewards is ERC20, Ownable {
    // Authorized contracts that can award tokens
    mapping(address => bool) public authorizedContracts;
    
    // Events
    event TokensAwarded(address indexed to, uint256 amount, string reason);
    event ContractAuthorized(address indexed contractAddress);
    event ContractDeauthorized(address indexed contractAddress);
    
    constructor() ERC20("DEV Token", "DEV") {
        // Initial supply for platform operations
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    /**
     * @dev Authorize a contract to award tokens
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = true;
        emit ContractAuthorized(contractAddress);
    }
    
    /**
     * @dev Deauthorize a contract
     */
    function deauthorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
        emit ContractDeauthorized(contractAddress);
    }
    
    /**
     * @dev Award tokens to a user
     */
    function awardTokens(address to, uint256 amount) external {
        require(authorizedContracts[msg.sender] || owner() == msg.sender, "Not authorized");
        
        _mint(to, amount * 10**decimals());
        emit TokensAwarded(to, amount, "Reward");
    }
    
    /**
     * @dev Award tokens to a user with reason
     */
    function awardTokensWithReason(address to, uint256 amount, string calldata reason) external {
        require(authorizedContracts[msg.sender] || owner() == msg.sender, "Not authorized");
        
        _mint(to, amount * 10**decimals());
        emit TokensAwarded(to, amount, reason);
    }
    
    /**
     * @dev Award tokens for specific EV charging behaviors
     */
    function awardFlexibleChargingTokens(address to, uint256 amount) external {
        require(authorizedContracts[msg.sender] || owner() == msg.sender, "Not authorized");
        
        _mint(to, amount * 10**decimals());
        emit TokensAwarded(to, amount, "FlexibleCharging");
    }
    
    /**
     * @dev Award tokens for off-peak charging
     */
    function awardOffPeakChargingTokens(address to, uint256 amount) external {
        require(authorizedContracts[msg.sender] || owner() == msg.sender, "Not authorized");
        
        _mint(to, amount * 10**decimals());
        emit TokensAwarded(to, amount, "OffPeakCharging");
    }
}