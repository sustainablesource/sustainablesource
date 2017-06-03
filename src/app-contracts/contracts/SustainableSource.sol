pragma solidity ^0.4.8;

contract SustainableSource {

  mapping (address => bool) public hasLicense;

  function payLicenseFeeFor(address account) payable {
      hasLicense[account] = true;
  }
}
