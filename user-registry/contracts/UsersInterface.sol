pragma solidity ^0.5.0;

contract UsersInterface {
    function userByHash(bytes32 usernameHash) public view returns (address);

    function user(string memory username) public view returns (address) {
        return userByHash(keccak256(bytes(username)));
    }
}
