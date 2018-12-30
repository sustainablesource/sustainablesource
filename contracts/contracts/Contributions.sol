pragma solidity ^0.5.0;

import "@sustainablesource/user-registry/contracts/UsersInterface.sol";
import "./ContributionsInterface.sol";
import "./PullRequestsInterface.sol";

contract Contributions is ContributionsInterface {
    uint total;
    address[] contributors;
    mapping (address => uint) contributions;
    mapping (uint => bool) registeredPullRequests;

    UsersInterface users;
    PullRequestsInterface pullRequests;

    constructor(
        UsersInterface users_,
        PullRequestsInterface pullRequests_
    ) public
    {
        users = users_;
        pullRequests = pullRequests_;
    }

    function registerContribution(uint pullRequestId) public {
        require(!registeredPullRequests[pullRequestId], "pull request is already registered");
        require(pullRequests.isMerged(pullRequestId), "pull request must be merged");
        bytes32 creatorHash = pullRequests.creatorHash(pullRequestId);
        address contributor = users.userByHash(creatorHash);
        require(contributor != address(0), "contributor is not registered");
        registeredPullRequests[pullRequestId] = true;
        addContribution(contributor);
    }

    function addContribution(address contributor) private {
        if (contributions[contributor] == 0) {
            contributors.push(contributor);
        }
        total++;
        contributions[contributor]++;
    }

    function totalContributions() public view returns (uint) {
        return total;
    }

    function numberOfContributors() public view returns (uint) {
        return contributors.length;
    }

    function getContributor(uint index) public view returns (address) {
        return contributors[index];
    }

    function numberOfContributions(address contributor)
        public
        view
        returns (uint)
    {
        return contributions[contributor];
    }
}
