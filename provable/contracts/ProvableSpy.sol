pragma solidity^0.5.0;

contract ProvableSpy {
    bytes32 queryIdToReturn;
    address provableAddressToReturn;
    mapping (string => mapping (uint => uint)) provablePriceToReturn;

    function returnProvableQueryIdsStartingFrom(bytes32 queryId) public {
        queryIdToReturn = queryId;
    }

    function alwaysReturnProvableAddress(address provableAddress) public {
        provableAddressToReturn = provableAddress;
    }

    function alwaysReturnProvablePrice(
        string memory datasource,
        uint gaslimit,
        uint price
    )
        public
    {
        provablePriceToReturn[datasource][gaslimit] = price;
    }

    function provable_query(
        string memory datasource,
        string memory arg,
        uint gaslimit
    )
        internal
        returns (bytes32 queryId)
    {
        emit ProvableQuery(datasource, arg, gaslimit);
        queryId = queryIdToReturn;
        queryIdToReturn = bytes32(uint256(queryIdToReturn) + 1);
    }

    function provable_setProof(byte proofType) internal {
        emit ProvableSetProof(proofType);
    }

    function provable_cbAddress() internal returns (address) {
        return provableAddressToReturn;
    }

    function provable_getPrice(string memory datasource, uint gaslimit)
        internal
        returns (uint)
    {
        return provablePriceToReturn[datasource][gaslimit];
    }

    event ProvableQuery(string datasource, string arg, uint gaslimit);
    event ProvableSetProof(byte proofType);
}
