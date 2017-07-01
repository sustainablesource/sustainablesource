pragma solidity ^0.4.8;
import "./GitHub.sol";

contract TestableGitHub is GitHub {
    string public latestOraclizeDataSource;
    string public latestOraclizeArg;
    byte public latestProofType;

    bytes32 queryIdToReturn;

    function alwaysReturnOraclizeQueryId(bytes32 queryId) {
        queryIdToReturn = queryId;
    }

    function oraclize_query(string datasource, string arg)
        internal
        returns (bytes32)
    {
        latestOraclizeDataSource = datasource;
        latestOraclizeArg = arg;
        return queryIdToReturn;
    }

    function oraclize_setProof(byte proofType) internal {
        latestProofType = proofType;
    }
}
