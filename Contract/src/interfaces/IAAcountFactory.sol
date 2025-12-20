// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAAcountFactory {
    event PoolCreated(address indexed pool, address indexed creator, string name);

    function createPool(string memory name, string memory description) external returns (address);
    function getPools() external view returns (address[] memory);
}
