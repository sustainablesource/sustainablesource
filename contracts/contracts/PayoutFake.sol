pragma solidity ^0.4.8;

import "./PayoutInterface.sol";

contract PayoutFake is PayoutInterface {
    function pay() public payable {}
}
