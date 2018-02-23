pragma solidity ^0.4.8;

import "./UsersInterface.sol";
import "./PullRequestsInterface.sol";

contract Payout {
    uint public totalNumberOfShares;
    address[] shareholders;
    mapping (address => uint) shares;

    UsersInterface users;
    PullRequestsInterface pullRequests;

    function Payout(UsersInterface users_, PullRequestsInterface pullRequests_) public {
        users = users_;
        pullRequests = pullRequests_;
    }

    function registerShare(uint pullRequestId) public {
        totalNumberOfShares++;
        bytes32 creatorHash = pullRequests.creatorHash(pullRequestId);
        address shareholder = users.userByHash(creatorHash);
        if (shares[shareholder] == 0) {
            shareholders.push(shareholder);
        }
        shares[shareholder]++;
    }

    function numberOfShareholders() public constant returns (uint) {
        return shareholders.length;
    }

    function getShareHolder(uint index) public constant returns (address) {
        return shareholders[index];
    }

    function numberOfShares(address shareholder) public constant returns (uint) {
        return shares[shareholder];
    }
}
