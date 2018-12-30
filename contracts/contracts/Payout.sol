pragma solidity ^0.4.8;

import "openzeppelin-solidity/contracts/payment/PullPayment.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ContributionsInterface.sol";
import "./PayoutInterface.sol";

contract Payout is PullPayment, PayoutInterface {
    using SafeMath for uint;

    ContributionsInterface contributions;

    constructor(ContributionsInterface contributions_) public {
        contributions = contributions_;
    }

    function pay() public payable {
        uint numberOfContributors = contributions.numberOfContributors();
        uint totalContributions = contributions.totalContributions();
        require(totalContributions > 0, "no contributions");
        for (uint i = 0; i < numberOfContributors; i++) {
            address contributor = contributions.getContributor(i);
            uint numberOfContributions = contributions.numberOfContributions(contributor);
            uint share = msg.value.mul(numberOfContributions).div(totalContributions);
            _asyncTransfer(contributor, share);
        }
    }
}
