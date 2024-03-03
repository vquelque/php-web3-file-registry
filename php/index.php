<?php
require 'vendor/autoload.php'; // Make sure the composer package `web3p/web3.php` is installed
use Web3\Web3;
use Web3\Contract;

// RPC URL
$rpcUrl = 'https://rpc-mumbai.maticvigil.com/';
$web3 = new Web3($rpcUrl);

// Contract ABI and Address
$contractABI = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"fileHash","type":"bytes32"}],"name":"DocumentHashSubmitted","type":"event"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"submitDocumentHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"hashes","type":"bytes32[]"}],"name":"submitDocumentsHashes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"submitted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"hashes","type":"bytes32[]"}],"name":"submitted","outputs":[{"internalType":"bool[]","name":"results","type":"bool[]"}],"stateMutability":"view","type":"function"}]';
$contractAddress = '0x08F620DeD366f36535904f1d36C86dcf4D8F60Be';

// Initialize the contract
$contract = new Contract($web3->provider, $contractABI);
$contract->at($contractAddress);


$contract->call('submitted', ['0x915316dd1cfc19b109b695ff7fc4f1ca0f1ba32883f57fd1ecde8eeaf51bf34f', '0xdb050d824de95614730c4dd04b9011bcc9369758b473ee29dbb2302d9c176910'], function ($err, $result) {
    if ($err !== null) {
        // Handle error
        echo 'Error: ' . $err->getMessage();
        return;
    }
    // Handle result
    echo 'Result: ';
    foreach ($result['results'] as $key => $value) {
        echo $key . ":";
        var_dump($value);
    }
    
});