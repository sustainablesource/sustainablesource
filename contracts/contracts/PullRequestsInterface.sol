pragma solidity ^0.5.0;

contract PullRequestsInterface {
    function creator(uint pullRequestId) public view returns (string memory);
    function isMerged(uint pullRequestId) public view returns (bool);

    function creatorHash(uint pullRequestId) public view returns (bytes32) {
        string memory username = creator(pullRequestId);
        if (bytes(username).length > 0) {
            return keccak256(bytes(username));
        }
    }
}
