// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import "../src/DocumentRegistry.sol";

contract DeployDocumentRegistry is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the DocumentRegistry contract
        DocumentRegistry registry = new DocumentRegistry();

        console.log("DocumentRegistry deployed to:", address(registry));

        vm.stopBroadcast();
    }
}
