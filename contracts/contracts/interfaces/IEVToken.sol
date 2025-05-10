// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEVToken {
    function mint(address to, uint256 amount) external returns (bool);
    function burn(address from, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}