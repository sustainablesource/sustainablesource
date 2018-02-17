pragma solidity ^0.4.8;
import "./UsersInterface.sol";

contract UsersFake is UsersInterface {
    mapping (string => address) usernameToAddress;

    function user(string username) public constant returns (address account) {
        return usernameToAddress[username];
    }

    function setUser(string username, address account) public {
        usernameToAddress[username] = account;
    }
}
