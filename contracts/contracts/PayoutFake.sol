pragma solidity ^0.5.0;

import "./PayoutInterface.sol";

contract PayoutFake is PayoutInterface {
    function pay() public payable {}
}
