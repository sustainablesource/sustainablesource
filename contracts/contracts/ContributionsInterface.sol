pragma solidity ^0.4.8;

contract ContributionsInterface {
    function totalContributions() public view returns (uint);
    function numberOfContributors() public view returns (uint);
    function getContributor(uint index) public view returns (address);
    function numberOfContributions(address contributor) public view returns (uint);
}
