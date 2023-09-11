import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { Fixture, Utils } from "./fixtures/utils";

describe("NFT", () => {

    let _fixture: Fixture;
    let _alice: SignerWithAddress;
    let _bob: SignerWithAddress;

    beforeEach(async () => {
        // Load the test fixture using a utility function (assuming it returns a Promise)
        _fixture = await loadFixture(new Utils().getFixture) as Fixture;

        // Get the signers (Ethereum accounts)
        [, _alice, _bob] = await ethers.getSigners();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(_fixture.owner.address).to.equal(await _fixture.contract.owner());
        });

        it("Auction should not be active initially", async function () {
            expect(await _fixture.contract.auctionActive()).to.equal(false);
        });
    });

    describe("Auction", function () {
        it("Should allow owner to start an auction", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 60);

            expect(await _fixture.contract.auctionActive()).to.equal(true);
        });

        it("Should not allow non-owner to start an auction", async function () {
            await expect(_fixture.contract.connect(_alice).startAuction(ethers.utils.parseEther("1"), 60)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow owner to start an auction when an auction is already active", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 60);
            await expect(_fixture.contract.startAuction(ethers.utils.parseEther("1"), 60)).to.be.revertedWithCustomError(_fixture.contract, "AuctionAlreadyActive");
        });

        it("Should not allow the owner ending the auction before the auction has started", async function () {
            await expect(_fixture.contract.endAuction()).to.be.revertedWithCustomError(_fixture.contract, "NoActiveAuction");
        });

        it("Should not allow the owner ending the auction before the auction has ended", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 1); // 1 minute for testing purposes
            await expect(_fixture.contract.endAuction()).to.be.revertedWithCustomError(_fixture.contract, "AuctionHasNotYetEnded");
        });

        it("Should allow owner to end the auction and transfer the NFT and funds", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 1); // 1 minute for testing purposes            
            await _fixture.contract.connect(_alice).bid({ value: ethers.utils.parseEther("1.5") });
            const initialBalance = await _fixture.owner.getBalance();

            await time.increase(120);
            await _fixture.contract.endAuction();
            const finalBalance = await _fixture.owner.getBalance();

            expect(finalBalance).to.be.gt(initialBalance);
            expect(await _fixture.contract.ownerOf(0)).to.equal(_alice.address);
        });
    });

    describe("Bids", function () {
        it("Should allow bids higher than the minimum bid", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 60);
            await _fixture.contract.connect(_alice).bid({ value: ethers.utils.parseEther("1.5") });

            expect(await _fixture.contract.highestBidder()).to.equal(_alice.address);
            expect(await _fixture.contract.highestBid()).to.equal(ethers.utils.parseEther("1.5"));
        });

        it("Should not allow bids when auction is not active", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 1); // 1 minute for testing purposes
            await time.increase(120);

            await expect(_fixture.contract.connect(_alice).bid({ value: ethers.utils.parseEther("1.5") })).to.be.revertedWithCustomError(_fixture.contract, "AuctionHasEnded");
        });

        it("Should not allow bids lower than the highest bid", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 60);
            _fixture.contract.connect(_alice).bid({ value: ethers.utils.parseEther("1.5") })

            await expect(_fixture.contract.connect(_bob).bid({ value: ethers.utils.parseEther("0.5") })).to.be.revertedWithCustomError(_fixture.contract, "BidAmountTooLow");
        });

        it("Should not allow bids lower than the minimum bid", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 60);
            await expect(_fixture.contract.connect(_alice).bid({ value: ethers.utils.parseEther("0.5") })).to.be.revertedWithCustomError(_fixture.contract, "BidBelowMinimum");
        });

        it("Should refund the previous highest bidder", async function () {
            await _fixture.contract.startAuction(ethers.utils.parseEther("1"), 60);

            await _fixture.contract.connect(_alice).bid({ value: ethers.utils.parseEther("1.5") });
            const aliceInitialBalance = await _alice.getBalance();

            await _fixture.contract.connect(_bob).bid({ value: ethers.utils.parseEther("2") });
            const aliceFinalBalance = await _alice.getBalance();

            expect(aliceFinalBalance).to.be.gt(aliceInitialBalance);
        });
    });
});