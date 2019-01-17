pragma solidity^0.5.0;

contract OraclizeSpy {
    bytes32 queryIdToReturn;
    address oraclizeAddressToReturn;
    mapping (string => mapping (uint => uint)) oraclizePriceToReturn;

    function returnOraclizeQueryIdsStartingFrom(bytes32 queryId) public {
        queryIdToReturn = queryId;
    }

    function alwaysReturnOraclizeAddress(address oraclizeAddress) public {
        oraclizeAddressToReturn = oraclizeAddress;
    }

    function alwaysReturnOraclizePrice(
        string memory datasource,
        uint gaslimit,
        uint price
    )
        public
    {
        oraclizePriceToReturn[datasource][gaslimit] = price;
    }

    function oraclize_query(
        string memory datasource,
        string memory arg,
        uint gaslimit
    )
        internal
        returns (bytes32 queryId)
    {
        emit OraclizeQuery(datasource, arg, gaslimit);
        queryId = queryIdToReturn;
        queryIdToReturn = bytes32(uint256(queryIdToReturn) + 1);
    }

    function oraclize_setProof(byte proofType) internal {
        emit OraclizeSetProof(proofType);
    }

    function oraclize_cbAddress() internal returns (address) {
        return oraclizeAddressToReturn;
    }

    function oraclize_getPrice(string memory datasource, uint gaslimit)
        internal
        returns (uint)
    {
        return oraclizePriceToReturn[datasource][gaslimit];
    }

    event OraclizeQuery(string datasource, string arg, uint gaslimit);
    event OraclizeSetProof(byte proofType);
}