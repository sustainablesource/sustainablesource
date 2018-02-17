pragma solidity ^0.4.8;

contract PullRequestsInterface {
    function creator(uint pullRequestId) constant returns (string creator);
    function isMerged(uint pullRequestId) constant returns (bool isMerged);
}