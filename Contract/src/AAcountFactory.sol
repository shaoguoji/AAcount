// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IAAcountFactory.sol";
import "./AAcountPool.sol";

contract AAcountFactory is IAAcountFactory {
    address[] public pools;

    function createPool(string memory name, string memory description) external returns (address) {
        AAcountPool pool = new AAcountPool();
        pool.initialize(msg.sender, name, description);
        pools.push(address(pool));
        
        emit PoolCreated(address(pool), msg.sender, name);
        return address(pool);
    }

    function getPools() external view returns (address[] memory) {
        return pools;
    }
}
