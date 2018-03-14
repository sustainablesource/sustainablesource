pragma solidity ^0.4.8;

contract ContributionsInterface {
    function numberOfContributors() public constant returns (uint);
    function getContributor(uint index) public constant returns (address);
    function numberOfContributions(address contributor) public constant returns (uint);
}
