pragma solidity ^0.4.8;

contract UsersInterface {
    function userByHash(bytes32 usernameHash) public view returns (address);

    function user(string username) public view returns (address) {
        return userByHash(keccak256(username));
    }
}
