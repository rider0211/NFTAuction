# NFTAuction

Solidity Developer Take-Home Challenge

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Tests](#tests)
- [Solhint](#solhint)
- [Slither](#slither)
- [License](#license)
- [Contact](#contact)

## Overview

Your task is to create and test an Ethereum smart contract that represents a simple auction for an NFT (Non-fungible token). The smart contract should include the following features:

### Auction creation:
The contract owner should be able to initiate an auction by setting the NFT up for auction, setting a minimum bid amount, and specifying the auction end time.

### Bidding:
Any Ethereum address should be able to place a bid on the NFT, provided that the bid is greater than the current highest bid and the auction has not yet ended.

### Auction closure:
After the auction end time has passed, the contract owner should be able to close the auction. The NFT should then be transferred to the highest bidder, and the funds sent to the contract owner.

## Requirements

### Smart Contracts:
Write the contract in Solidity, using Solidity version 0.8.4 or above.

### Testing:
Write unit tests for your contract using a framework like Truffle or Hardhat. The tests should cover all the major functionalities of the contract.

### Deployment Instructions:
Provide a detailed guide on how to deploy the smart contract on both a local Ethereum blockchain (such as Ganache) and a test network like Rinkeby or Ropsten.

## Getting Started

To get started with this project, you'll need to follow these steps:

Clone this repository to your local machine:
```shell
git clone https://github.com/xhulz/NFTAuction.git
```

Navigate to the project directory:
```shell
cd NFTAuction
```

Rename the .env.example to .env.
```shell
mv .env.example .env
```

Install the required dependencies:
```shell
npm install
```

Compile the project:
```shell
npm run compile
```

## Tests
To run the tests for this project, you can use the following command:

```shell
npm run test
```

## Deploy

### Local
To deploy locally, you can use the following command:

```shell
npm run deploy:local
```

### Sepolia
To deploy on the Sepolia network, you should follow the steps below:

1. Change the .env file with data for the keys below:
```shell
INFURA_API_KEY = your_infura_key
SEPOLIA_PRIVATE_KEY = your_private_key
```

2. Run the command for deployment:
```shell
npm run deploy:sepolia
```

To verify on the Sepolia network, you should follow the steps below:

1. Change the .env file and add your new contract address
```shell
CONTRACT = your_contract
```

2. Run the command for verification:
```shell
npm run verify:sepolia
```

## Solhint

[Solhint](https://github.com/protofire/solhint) is a static analysis tool designed specifically for Solidity contracts. It allows you to identify and address potential issues and bad practices in your Solidity code, helping to enhance the quality and security of your codebase. Solhint operates based on configurable linting rules, which are applied to your code to ensure it complies with development best practices.

```shell
npm run lint
```

### Slither Analysis

[Slither](https://github.com/crytic/slither) is a static analysis tool for Solidity smart contracts. It helps you identify potential vulnerabilities, security flaws, and issues in your Ethereum smart contracts by analyzing the source code. Running Slither on your project can provide valuable insights into potential vulnerabilities and help you write more secure smart contracts.

```shell
npm run slither
```

## License

This project is licensed under the [License Name](License URL) - see the [LICENSE.md](LICENSE.md) file for more details.

## Contact

- xhulz - [wpmwsc@gmail.com](wpmwsc@gmail.com)
