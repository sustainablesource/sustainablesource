pragma solidity^0.4.6;

contract OraclizeSpy {
    bytes32 queryIdToReturn;
    address oraclizeAddressToReturn;
    mapping (string => mapping (uint => uint)) oraclizePriceToReturn;

    function alwaysReturnOraclizeQueryId(bytes32 queryId) {
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
        returns (bytes32)
    {
        OraclizeQuery(datasource, arg, gaslimit);
        return queryIdToReturn;
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
