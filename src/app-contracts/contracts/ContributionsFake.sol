pragma solidity ^0.4.8;

import "./ContributionsInterface.sol";

contract ContributionsFake is ContributionsInterface {
    address[] contributors;
    mapping(address => uint) contributions;

    function addContributor(address contributor) public {
        contributors.push(contributor);
    }    

    function setContributions(address contributor, uint amount) public {
        contributions[contributor] = amount;
    }

    function numberOfContributors() public constant returns (uint) {
        return contributors.length;
    }

    function getContributor(uint index) public constant returns (address) {
        return contributors[index];
    }

    function numberOfContributions(address contributor) 
        public
        constant
        returns (uint)
    {
        return contributions[contributor];
    }
}
