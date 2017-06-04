pragma solidity ^0.4.8;
import "./zeppelin/ownership/Ownable.sol";

contract SustainableSource is Ownable {

  mapping (address => bool) public hasLicense;
  uint public licenseFeeInWei;

  function SustainableSource(uint licenseFeeInWei_) {
    licenseFeeInWei = licenseFeeInWei_;
  }

  function setLicenseFee(uint licenseFeeInWei_) onlyOwner {
    licenseFeeInWei = licenseFeeInWei_;
  }

  function payLicenseFeeFor(address account) payable {
      if (msg.value != licenseFeeInWei) {
        throw;
      }
      hasLicense[account] = true;
  }
}
