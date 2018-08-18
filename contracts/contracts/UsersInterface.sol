pragma solidity ^0.4.8;

contract UsersInterface {
    function userByHash(bytes32 usernameHash) public constant returns (address);

    function user(string username) public constant returns (address) {
        return userByHash(keccak256(username));
    }
}
