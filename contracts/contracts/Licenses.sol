pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./PayoutInterface.sol";

contract Licenses is Ownable {
    uint public licenseFeeInWei;
    mapping(string => mapping(address => bool)) licenses;
    PayoutInterface payout;

    constructor(PayoutInterface payout_, uint licenseFeeInWei_) public {
        payout = payout_;
        licenseFeeInWei = licenseFeeInWei_;
    }

    function setLicenseFee(uint licenseFeeInWei_) public onlyOwner {
        licenseFeeInWei = licenseFeeInWei_;
    }

    function payLicenseFee(address account, string memory version)
        public
        payable
    {
        require(msg.value == licenseFeeInWei, "incorrect payment");

        payout.pay.value(msg.value)();
        licenses[version][account] = true;
    }

    function hasLicense(address account, string memory version)
        public
        view
        returns (bool)
    {
        return licenses[version][account];
    }
}
