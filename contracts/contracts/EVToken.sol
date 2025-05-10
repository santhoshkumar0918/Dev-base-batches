// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IEVToken.sol";

contract EVToken is ERC20, Ownable, IEVToken {
    mapping(address => bool) private _minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    constructor() ERC20("EVToken", "EVT") Ownable(msg.sender) {
        // Initial supply minted to deployer
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    modifier onlyMinter() {
        require(_minters[msg.sender] || msg.sender == owner(), "EVToken: caller is not a minter");
        _;
    }
    
    function addMinter(address minter) external onlyOwner {
        _minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    function removeMinter(address minter) external onlyOwner {
        _minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    function mint(address to, uint256 amount) external override onlyMinter returns (bool) {
        _mint(to, amount);
        return true;
    }
    
    function burn(address from, uint256 amount) external override onlyMinter returns (bool) {
        _burn(from, amount);
        return true;
    }
}