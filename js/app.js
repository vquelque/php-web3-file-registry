import { ethers } from './ethers.min.js';

export class Web3Handler {
  constructor() {
    this.connectWalletButton = document.getElementById('connectWallet');
    this.setupEventListeners();
  }

  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        this.provider = new ethers.BrowserProvider(window.ethereum);
        const { chainId } = await this.provider.getNetwork();
        if (chainId !== 80001) {
          await this.switchToMumbai();
        }
        this.signer = await this.provider.getSigner();
        this.connectWalletButton.disabled = true; // Disable the button after successful connection
        alert('Le Wallet Web3 a été connecté avec succès!');
      } catch (error) {
        console.error(error);
        alert('Erreur de connexion au wallet Web3.');
      }
    } else {
      alert("Merci d'installer MetaMask avant d'utiliser ce service.");
    }
  }

  async submitHash() {
    const hashInput = document.getElementById('hashInput');
    const hash = hashInput.value.trim().replace(/^0x/, '');
    if (!hash || hash.length !== 64) {
      alert("Merci d'entrer un hash valide.");
      return;
    }

    if (!this.signer) {
      alert("Merci de connecter un wallet Web3 avant d'utiliser ce service");
      return;
    }

    const { chainId } = await this.provider.getNetwork();
    if (chainId !== 80001) {
      await this.switchToMumbai();
    }

    const contractAddress = '0x08F620DeD366f36535904f1d36C86dcf4D8F60Be';
    const contractABI = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'fileHash',
            type: 'bytes32',
          },
        ],
        name: 'DocumentHashSubmitted',
        type: 'event',
      },
      {
        inputs: [{ internalType: 'bytes32', name: 'hash', type: 'bytes32' }],
        name: 'submitDocumentHash',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32[]', name: 'hashes', type: 'bytes32[]' },
        ],
        name: 'submitDocumentsHashes',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'bytes32', name: 'hash', type: 'bytes32' }],
        name: 'submitted',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32[]', name: 'hashes', type: 'bytes32[]' },
        ],
        name: 'submitted',
        outputs: [{ internalType: 'bool[]', name: 'results', type: 'bool[]' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      this.signer
    );

    try {
      const tx = await contract.submitDocumentHash('0x' + hash);
      const spinner = document.getElementById('spinner');
      spinner.style.display = 'block'; // Display the spinner
      alert(`La transaction a été soumise. Tx hash: ${tx.hash}`)
      const receipt = await tx.wait();
      console.log(receipt);

      alert('Le hash a été soumis avec succès!');
    } catch (error) {
      console.error(error);
      alert('Désolé, une erreur a eu lieu lors de la soumission du hash.');
    } finally {
        // Hide the spinner
        spinner.style.display = 'none';
      }
  }

  // Check if MetaMask is already connected
  async checkIfWalletIsConnected() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          this.connectWalletButton.disabled = true; // Disable the button if an account is already connected
          this.provider = new ethers.BrowserProvider(window.ethereum);
          this.signer = await this.provider.getSigner();
        }
      } catch (error) {
        console.error('Error checking if wallet is connected:', error);
      }
    }
  }
  // Prompt the user to switch to the Polygon Mumbai network
  async switchToMumbai() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // 0x13881 is the chainId for Polygon Mumbai in hexadecimal
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Mumbai Testnet',
                nativeCurrency: {
                  name: 'Matic',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add the Mumbai network:', addError);
        }
      } else {
        console.error('Failed to switch to the Mumbai network:', switchError);
      }
    }
  }

  setupEventListeners() {
    this.connectWalletButton.addEventListener('click', () =>
      this.connectWallet()
    );
    document
      .getElementById('submitHash')
      .addEventListener('click', () => this.submitHash());

    window.addEventListener('load', () => this.checkIfWalletIsConnected());
  }
}
