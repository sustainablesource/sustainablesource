pragma solidity^0.4.6;

contract OraclizeSpy {
    bytes32 queryIdToReturn;
    address oraclizeAddressToReturn;
    mapping (string => mapping (uint => uint)) oraclizePriceToReturn;

    function returnOraclizeQueryIdsStartingFrom(bytes32 queryId) {
        queryIdToReturn = queryId;
    }

    function alwaysReturnOraclizeAddress(address oraclizeAddress) {
        oraclizeAddressToReturn = oraclizeAddress;
    }

    function alwaysReturnOraclizePrice(
        string datasource,
        uint gaslimit,
        uint price)
    {
      oraclizePriceToReturn[datasource][gaslimit] = price;
    }

    function oraclize_query(string datasource, string arg, uint gaslimit)
        internal
        returns (bytes32 queryId)
    {
        OraclizeQuery(datasource, arg, gaslimit);
        queryId = queryIdToReturn;
        queryIdToReturn = bytes32(uint256(queryIdToReturn) + 1);
    }

    function oraclize_setProof(byte proofType) internal {
        OraclizeSetProof(proofType);
    }

    function oraclize_cbAddress() internal returns (address) {
        return oraclizeAddressToReturn;
    }

    function oraclize_getPrice(string datasource, uint gaslimit)
        internal
        returns (uint)
    {
        return oraclizePriceToReturn[datasource][gaslimit];
    }

    event OraclizeQuery(string datasource, string arg, uint gaslimit);
    event OraclizeSetProof(byte proofType);
}
