import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MyToken } from "../../typechain-types";

type Fixture = {
    owner: SignerWithAddress;
    contract: MyToken;
};

class Utils {
    public async getFixture(): Promise<Fixture> {
        // Get the signers (Ethereum accounts)
        const [owner] = await ethers.getSigners();

        // Get the contract factory for the "Campaign" contract
        const token = await ethers.getContractFactory("MyToken", owner);

        // Deploy an instance of the "Campaign" contract
        const contract = await token.deploy();

        // Wait for the contract deployment to complete
        await contract.deployed();

        // Return a Fixture object containing the owner's signer, implementation, and factory
        return { owner, contract };
    }
}

export { Fixture, Utils };