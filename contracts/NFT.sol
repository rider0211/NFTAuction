// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyToken is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    // Counter to keep track of the total number of tokens minted
    Counters.Counter private _tokenIdCounter;

    // The time when the auction will end
    uint256 public auctionEndTime;

    // Address of the current highest bidder
    address public highestBidder;

    // The highest bid amount in the current auction
    uint256 public highestBid;

    // The minimum bid amount required to participate in the auction
    uint256 public minimumBid;

    // Flag to indicate if the auction is currently active
    bool public auctionActive = false;

    // Custom errors

    /**
     * @dev Error thrown when trying to start an auction that's already active.
     */
    error AuctionAlreadyActive();

    /**
     * @dev Error thrown when trying to perform an action after the auction has ended.
     */
    error AuctionHasEnded();

    /**
     * @dev Error thrown when a bid amount is lower than the current highest bid.
     */
    error BidAmountTooLow();

    /**
     * @dev Error thrown when a bid amount is below the specified minimum bid.
     */
    error BidBelowMinimum();

    /**
     * @dev Error thrown when trying to perform an action without an active auction.
     */
    error NoActiveAuction();

    /**
     * @dev Error thrown when trying to end an auction that hasn't reached its end time.
     */
    error AuctionHasNotYetEnded();

    // Events

    /**
     * @dev Emitted when a new auction is started.
     * @param endTime The time when the auction will end.
     * @param minBid The minimum bid amount required to participate in the auction.
     */
    event AuctionStarted(uint256 endTime, uint256 minBid);

    /**
     * @dev Emitted when a new bid is placed in the auction.
     * @param bidder The address of the bidder.
     * @param amount The amount of the bid.
     */
    event NewBid(address indexed bidder, uint256 amount);

    /**
     * @dev Emitted when the auction ends.
     * @param winner The address of the highest bidder.
     * @param winningBid The amount of the highest bid.
     */
    event AuctionEnded(address indexed winner, uint256 winningBid);

    /**
     * @dev Initializes the `MyToken` contract, setting its name and symbol.
     * Inherits from the ERC721 contract.
     */
    constructor() ERC721("MyToken", "MTK") {}

    /**
     * @dev Returns the base URI set for the NFT. This base URI is used for all token IDs by appending the token ID to this base URI.
     * @return A string representing the base URI.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "http://my.nft.io";
    }

    /**
     * @dev Safely mints a new NFT token and assigns it to the provided address.
     * Only the owner of the contract can call this function.
     * @param __to The address to which the newly minted token will be assigned.
     */
    function safeMint(address __to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(__to, tokenId);
    }

    /**
     * @dev Starts a new auction with the specified minimum bid and duration.
     * Only the owner of the contract can initiate an auction.
     * If an auction is already active, it throws an `AuctionAlreadyActive` error.
     *
     * @param __minimumBid The minimum amount required to place a bid in the auction.
     * @param __durationInMinutes The duration of the auction in minutes.
     */
    function startAuction(
        uint256 __minimumBid,
        uint256 __durationInMinutes
    ) public onlyOwner {
        if (auctionActive) revert AuctionAlreadyActive();

        auctionEndTime = block.timestamp.add(
            __durationInMinutes.mul(1 minutes)
        );
        minimumBid = __minimumBid;
        auctionActive = true;

        emit AuctionStarted(auctionEndTime, minimumBid);
    }

    /**
     * @dev Allows an address to place a bid in the active auction.
     * The sent amount (msg.value) is considered as the bid amount.
     * If the auction has ended, it throws an `AuctionHasEnded` error.
     * If the bid amount is less than or equal to the current highest bid, it throws a `BidAmountTooLow` error.
     * If the bid amount is less than the minimum bid, it throws a `BidBelowMinimum` error.
     * The previously highest bidder gets refunded when outbid.
     *
     * Emits a `NewBid` event when a valid bid is placed.
     */
    function bid() public payable nonReentrant {
        if (block.timestamp > auctionEndTime) revert AuctionHasEnded();
        if (msg.value <= highestBid) revert BidAmountTooLow();
        if (msg.value < minimumBid) revert BidBelowMinimum();

        if (highestBidder != address(0)) {
            // Refund the previously highest bidder
            payable(highestBidder).transfer(highestBid);
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit NewBid(msg.sender, msg.value);
    }

    /**
     * @dev Ends the active auction, transferring the NFT to the highest bidder and the funds to the contract owner.
     * Only the owner of the contract can end the auction.
     * If the auction has not yet reached its end time, it throws an `AuctionHasNotYetEnded` error.
     * If there's no active auction, it throws a `NoActiveAuction` error.
     *
     * Emits an `AuctionEnded` event upon successful completion.
     */
    function endAuction() public onlyOwner {
        if (block.timestamp < auctionEndTime) revert AuctionHasNotYetEnded();
        if (!auctionActive) revert NoActiveAuction();

        auctionActive = false;

        // Transfer the NFT to the highest bidder
        safeMint(highestBidder);

        // Transfer the funds to the contract owner
        payable(owner()).transfer(highestBid);

        emit AuctionEnded(highestBidder, highestBid);
    }
}
