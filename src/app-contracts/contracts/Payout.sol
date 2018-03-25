pragma solidity ^0.4.8;

import "zeppelin/payment/PullPayment.sol";
import "zeppelin/SafeMath.sol";
import "./ContributionsInterface.sol";

contract Payout is PullPayment {
    using SafeMath for uint;

    ContributionsInterface contributions;

    function Payout(ContributionsInterface contributions_) public {
        contributions = contributions_;
    }

    function pay() public payable {
        uint numberOfContributors = contributions.numberOfContributors();
        uint totalContributions = contributions.totalContributions();
        require(totalContributions > 0);
        for (uint i = 0; i < numberOfContributors; i++) {
            address contributor = contributions.getContributor(i);
            uint numberOfContributions = contributions.numberOfContributions(contributor);
            uint share = msg.value.mul(numberOfContributions).div(totalContributions);
            asyncSend(contributor, share);
        }
    }
}
