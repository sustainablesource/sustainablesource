pragma solidity ^0.5.0;

import "@sustainablesource/user-registry/contracts/UsersInterface.sol";
import "./PullRequestsInterface.sol";
import "./PullRequests.sol";
import "./ContributionsInterface.sol";
import "./Contributions.sol";
import "./PayoutInterface.sol";
import "./Payout.sol";
import "./Licenses.sol";

contract SustainableSource {
    UsersInterface public users;
    PullRequestsInterface public pullrequests;
    ContributionsInterface public contributions;
    PayoutInterface public payout;
    Licenses public licenses;

    constructor(
        UsersInterface users_,
        string memory repo,
        uint licenseFeeInWei
    ) public {
        users = users_;
        pullrequests = new PullRequests(repo);
        contributions = new Contributions(users, pullrequests);
        payout = new Payout(contributions);
        licenses = new Licenses(payout, licenseFeeInWei);
    }
}
