pragma solidity ^0.4.8;

contract SustainableSource {

  mapping (address => bool) public hasLicense;
  uint licenseFee;

  function SustainableSource(uint licenseFeeInWei) {
    licenseFee = licenseFeeInWei;
  }

  function payLicenseFeeFor(address account) payable {
      if (msg.value != licenseFee) {
        throw;
      }
      hasLicense[account] = true;
  }
}
