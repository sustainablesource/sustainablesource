pragma solidity ^0.4.8;
import "./zeppelin/ownership/Ownable.sol";

contract SustainableSource is Ownable {

  mapping(string => mapping(address => bool)) licenses;
  uint public licenseFeeInWei;

  function SustainableSource(uint licenseFeeInWei_) {
    licenseFeeInWei = licenseFeeInWei_;
  }

  function setLicenseFee(uint licenseFeeInWei_) onlyOwner {
    licenseFeeInWei = licenseFeeInWei_;
  }

  function payLicenseFee(address account, string version) payable {
      if (msg.value != licenseFeeInWei) {
        throw;
      }

      licenses[version][account] = true;
  }

  function hasLicense(address account, string version) constant returns (bool) {
    return licenses[version][account];
  }
}
