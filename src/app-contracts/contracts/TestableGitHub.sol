pragma solidity ^0.4.8;
import "./GitHub.sol";

contract TestableGitHub is GitHub {
    string public latestOraclizeDataSource;
    string public latestOraclizeArg;
    uint public latestOraclizeGasLimit;
    byte public latestProofType;

    bytes32 queryIdToReturn;
    address oraclizeAddressToReturn;

    function alwaysReturnOraclizeQueryId(bytes32 queryId) {
        queryIdToReturn = queryId;
    }

    function alwaysReturnOraclizeAddress(address oraclizeAddress) {
        oraclizeAddressToReturn = oraclizeAddress;
    }

    function oraclize_query(string datasource, string arg, uint gaslimit)
        internal
        returns (bytes32)
    {
        latestOraclizeDataSource = datasource;
        latestOraclizeArg = arg;
        latestOraclizeGasLimit = gaslimit;
        return queryIdToReturn;
    }

    function oraclize_setProof(byte proofType) internal {
        latestProofType = proofType;
    }

    function oraclize_cbAddress() internal returns (address) {
        return oraclizeAddressToReturn;
    }
}
