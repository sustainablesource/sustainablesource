pragma solidity ^0.5.0;

import "./ContributionsInterface.sol";

contract ContributionsFake is ContributionsInterface {
    uint total;
    address[] contributors;
    mapping(address => uint) contributions;

    function addContributor(address contributor) public {
        contributors.push(contributor);
    }

    function addContributions(address contributor, uint amount) public {
        total += amount;
        contributions[contributor] += amount;
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
