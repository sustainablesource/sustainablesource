pragma solidity ^0.4.8;

import "./UsersInterface.sol";
import "./PullRequestsInterface.sol";

contract Contributions {
    uint public totalContributions;
    address[] contributors;
    mapping (address => uint) contributions;
    mapping (uint => bool) registeredPullRequests;

    UsersInterface users;
    PullRequestsInterface pullRequests;

    function Contributions(
        UsersInterface users_, 
        PullRequestsInterface pullRequests_
    ) public 
    {
        users = users_;
        pullRequests = pullRequests_;
    }

    function registerContribution(uint pullRequestId) public {
        require(!registeredPullRequests[pullRequestId]);
        require(pullRequests.isMerged(pullRequestId));
        bytes32 creatorHash = pullRequests.creatorHash(pullRequestId);
        address contributor = users.userByHash(creatorHash);
        require(contributor != 0);
        if (contributions[contributor] == 0) {
            contributors.push(contributor);
        }
        registeredPullRequests[pullRequestId] = true;
        totalContributions++;
        contributions[contributor]++;
    }

    function numberOfContributors() public constant returns (uint) {
        return contributors.length;
    }

    function getContributor(uint index) public constant returns (address) {
        return contributors[index];
    }

    function numberOfContributions(address contributor) 
        public 
        constant 
        returns (uint) 
    {
        return contributions[contributor];
    }
}
