pragma solidity ^0.4.8;
import "./PullRequestsInterface.sol";

contract PullRequestsFake is PullRequestsInterface {
    mapping (uint => string) pullRequestIdToCreator;
    mapping (uint => bool) pullRequestIdToMergedState;

    function creator(uint pullRequestId) public view returns (string) {
        return pullRequestIdToCreator[pullRequestId];
    }

    function setCreator(uint pullRequestId, string creator_) public {
        pullRequestIdToCreator[pullRequestId] = creator_;
    }

    function isMerged(uint pullRequestId) public view returns (bool) {
        return pullRequestIdToMergedState[pullRequestId];
    }

    function setIsMerged(uint pullRequestId, bool isMerged_) public {
        pullRequestIdToMergedState[pullRequestId] = isMerged_;
    }
}
