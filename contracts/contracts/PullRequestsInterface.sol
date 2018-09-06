pragma solidity ^0.4.8;

contract PullRequestsInterface {
    function creator(uint pullRequestId) public view returns (string);
    function isMerged(uint pullRequestId) public view returns (bool);

    function creatorHash(uint pullRequestId) public view returns (bytes32) {
        string memory username = creator(pullRequestId);
        if (bytes(username).length > 0) {
            return keccak256(bytes(username));
        }
    }
}
