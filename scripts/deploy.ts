import { ethers } from "hardhat";

async function deploy(): Promise<void> {
    // Get the signers (Ethereum accounts)
    const [owner] = await ethers.getSigners();

    // Get the contract factory for the "Campaign" contract
    const token = await ethers.getContractFactory("MyToken", owner);

    // Deploy an instance of the "Campaign" contract
    const contract = await token.deploy();

    // Wait for the contract deployment to complete
    await contract.deployed();

    // Print the contract address
    console.log("MyToken deployed to:", contract.address);
}

deploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});