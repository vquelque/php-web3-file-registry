// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "../src/DocumentRegistry.sol";

contract DocumentRegistryTest is Test, DocumentRegistry {
    DocumentRegistry registry;

    function setUp() public {
        registry = new DocumentRegistry();
    }

    function testSubmitDocumentHash() public {
        bytes32 testHash = keccak256("Test Document");
        vm.expectEmit(true, true, false, true);
        emit DocumentHashSubmitted(testHash);
        registry.submitDocumentHash(testHash);
    }

    function testCheckSubmittedSingle() public {
        bytes32 testHash = keccak256("Test Document");
        registry.submitDocumentHash(testHash);
        bool isSubmitted = registry.submitted(testHash);
        assertTrue(isSubmitted);
    }

    function testSubmitDocumentsHashes() public {
        bytes32[] memory testHashes = new bytes32[](2);
        testHashes[0] = keccak256("Document 1");
        testHashes[1] = keccak256("Document 2");

        for (uint256 i = 0; i < testHashes.length; ++i) {
            vm.expectEmit(true, true, false, true);
            emit DocumentHashSubmitted(testHashes[i]);
        }

        registry.submitDocumentsHashes(testHashes);
    }

    function testCheckSubmittedMultiple() public {
        bytes32[] memory testHashes = new bytes32[](2);
        testHashes[0] = keccak256("Document 1");
        testHashes[1] = keccak256("Document 2");
        registry.submitDocumentsHashes(testHashes);

        bool[] memory isSubmitted = registry.submitted(testHashes);
        for (uint256 i = 0; i < isSubmitted.length; ++i) {
            assertTrue(isSubmitted[i]);
        }
    }
}
