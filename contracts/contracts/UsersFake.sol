pragma solidity ^0.4.8;
import "./UsersInterface.sol";

contract UsersFake is UsersInterface {
    mapping (bytes32 => address) usernameHashToAddress;

    function userByHash(bytes32 usernameHash) public constant returns (address) {
        return usernameHashToAddress[usernameHash];
    }

    function setUser(string username, address account) public {
        usernameHashToAddress[keccak256(username)] = account;
    }
}
