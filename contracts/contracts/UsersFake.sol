pragma solidity ^0.5.0;
import "./UsersInterface.sol";

contract UsersFake is UsersInterface {
    mapping (bytes32 => address) usernameHashToAddress;

    function userByHash(bytes32 usernameHash) public view returns (address) {
        return usernameHashToAddress[usernameHash];
    }

    function setUser(string memory username, address account) public {
        usernameHashToAddress[keccak256(bytes(username))] = account;
    }
}
