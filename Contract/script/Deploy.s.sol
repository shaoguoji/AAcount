// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AAcountFactory.sol";

contract DeployAAcount is Script {
    function run() external {
        // uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // vm.startBroadcast(deployerPrivateKey);
        vm.startBroadcast();

        AAcountFactory factory = new AAcountFactory();
        
        console.log("AAcountFactory deployed to:", address(factory)); // This is important for frontend

        vm.stopBroadcast();
    }
}
