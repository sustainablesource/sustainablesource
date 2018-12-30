pragma solidity ^0.5.0;
import "./PullRequestsInterface.sol";

contract PullRequestsFake is PullRequestsInterface {
    string repo;
    mapping (uint => string) pullRequestIdToCreator;
    mapping (uint => bool) pullRequestIdToMergedState;

    function repository() public view returns (string memory) {
        return repo;
    }

    function setRepository(string memory repo_) public {
        repo = repo_;
    }

    function creator(uint pullRequestId) public view returns (string memory) {
        return pullRequestIdToCreator[pullRequestId];
    }

    function setCreator(uint pullRequestId, string memory creator_) public {
        pullRequestIdToCreator[pullRequestId] = creator_;
    }

    function isMerged(uint pullRequestId) public view returns (bool) {
        return pullRequestIdToMergedState[pullRequestId];
    }

    function setIsMerged(uint pullRequestId, bool isMerged_) public {
        pullRequestIdToMergedState[pullRequestId] = isMerged_;
    }
}
