// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Note: SafeMath is generally not needed for Solidity 0.8.0+ as overflow/underflow checks are built-in
// This is kept for compatibility or if you need specific functionality
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }
}