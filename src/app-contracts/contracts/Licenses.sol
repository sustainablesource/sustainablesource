pragma solidity ^0.4.8;
import "zeppelin/ownership/Ownable.sol";

contract Licenses is Ownable {

    mapping(string => mapping(address => bool)) licenses;
    uint public licenseFeeInWei;

    function Licenses(uint licenseFeeInWei_) public {
        licenseFeeInWei = licenseFeeInWei_;
    }

    function setLicenseFee(uint licenseFeeInWei_) public onlyOwner {
        licenseFeeInWei = licenseFeeInWei_;
    }

    function payLicenseFee(address account, string version) public payable {
        require(msg.value == licenseFeeInWei);

        licenses[version][account] = true;
    }

    function hasLicense(address account, string version)
        public
        constant
        returns (bool)
    {
        return licenses[version][account];
    }
}
