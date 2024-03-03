// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract DocumentRegistry {
    
    event DocumentHashSubmitted(bytes32 indexed fileHash);

    mapping(bytes32 => bool) private documents;

    // Submit a single document's hash
    function submitDocumentHash(bytes32 hash) external {
        documents[hash] = true;
        emit DocumentHashSubmitted(hash);
    }

    // Submit multiple documents' hashes
    function submitDocumentsHashes(bytes32[] calldata hashes) external {
        for (uint256 i; i < hashes.length;) {
            documents[hashes[i]] = true;
            emit DocumentHashSubmitted(hashes[i]);
            unchecked {
                ++i;
            }
        }
    }

    // Check if a document's hash has been submitted
    function submitted(bytes32 hash) external view returns (bool) {
        return documents[hash];
    }

    // Check if multiple documents' hashes have been submitted
    function submitted(bytes32[] calldata hashes) external view returns (bool[] memory results) {
        results = new bool[](hashes.length);
        for (uint256 i; i < hashes.length;) {
            results[i] = documents[hashes[i]];
            unchecked {
                ++i;
            }
        }
    }
}
