// Get funds from users
// withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

// custom errors
error NotOwner();

// 958925 gas before
// 936431 gas after constant
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        // want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to this contract
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "Didn't send enough!"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        // require(msg.sender == i_owner, "Sender is not i_owner.");
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // reset the array starting with 0 element
        funders = new address[](0);

        // // actually withdraw the funds

        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    // modifier
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner.");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    // what happnes if someone sends this contract ETH with fund() function

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
