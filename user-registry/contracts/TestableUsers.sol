pragma solidity ^0.5.0;
import "./Users.sol";
import "@sustainablesource/oraclize/contracts/OraclizeSpy.sol";

contract TestableUsers is Users, OraclizeSpy {
}
