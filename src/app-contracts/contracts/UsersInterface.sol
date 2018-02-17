pragma solidity ^0.4.8;

contract UsersInterface {
    function user(string username) public constant returns (address account);
}
