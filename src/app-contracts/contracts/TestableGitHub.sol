pragma solidity ^0.4.8;
import "./GitHub.sol";

contract TestableGitHub is GitHub {
    string public latestOraclizeDataSource;
    string public latestOraclizeArg;
    byte public latestProofType;

    function oraclize_query(string datasource, string arg)
        internal
        returns (bytes32)
    {
        latestOraclizeDataSource = datasource;
        latestOraclizeArg = arg;
    }

    function oraclize_setProof(byte proofType) internal {
        latestProofType = proofType;
    }
}
