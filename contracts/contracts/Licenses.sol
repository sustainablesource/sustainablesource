pragma solidity ^0.4.8;
import "zeppelin/ownership/Ownable.sol";
import "./PayoutInterface.sol";

contract Licenses is Ownable {
    uint public licenseFeeInWei;
    mapping(string => mapping(address => bool)) licenses;
    PayoutInterface payout;

    function Licenses(PayoutInterface payout_, uint licenseFeeInWei_) public {
        payout = payout_;
        licenseFeeInWei = licenseFeeInWei_;
    }

    function setLicenseFee(uint licenseFeeInWei_) public onlyOwner {
        licenseFeeInWei = licenseFeeInWei_;
    }

    function payLicenseFee(address account, string version) public payable {
        require(msg.value == licenseFeeInWei, "incorrect payment");

        payout.pay.value(msg.value)();
        licenses[version][account] = true;
    }

    function hasLicense(address account, string version)
        public
        view
        returns (bool)
    {
        return licenses[version][account];
    }
}
