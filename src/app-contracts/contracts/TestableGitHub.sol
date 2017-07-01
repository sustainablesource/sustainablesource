pragma solidity ^0.4.8;
import "./GitHub.sol";

contract TestableGitHub is GitHub {
    string public latestOraclizeDataSource;
    string public latestOraclizeArg;

    function oraclize_query(string datasource, string arg)
        internal
        returns (bytes32)
    {
        latestOraclizeDataSource = datasource;
        latestOraclizeArg = arg;
    }
}
