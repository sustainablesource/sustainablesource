pragma solidity ^0.4.8;
import "./PullRequestsInterface.sol";

contract PullRequestsFake is PullRequestsInterface {
    mapping (uint => string) pullRequestIdToCreator;
    mapping (uint => bool) pullRequestIdToMergedState;

    function creator(uint pullRequestId) constant returns (string creator) {
        return pullRequestIdToCreator[pullRequestId];
    }

    function setCreator(uint pullRequestId, string creator) {
        pullRequestIdToCreator[pullRequestId] = creator;
    }

    function isMerged(uint pullRequestId) constant returns (bool isMerged) {
        return pullRequestIdToMergedState[pullRequestId];
    }

    function setIsMerged(uint pullRequestId, bool isMerged) {
        pullRequestIdToMergedState[pullRequestId] = isMerged;
    }
}