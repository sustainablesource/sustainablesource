pragma solidity ^0.5.0;
import "./Users.sol";
import "@sustainablesource/provable/contracts/ProvableSpy.sol";

contract TestableUsers is Users, ProvableSpy {
}
