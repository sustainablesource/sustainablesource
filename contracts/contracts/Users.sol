pragma solidity ^0.4.8;
import "oraclize/usingOraclize.sol";
import "./Conversions.sol";
import "./UsersInterface.sol";

contract Users is UsersInterface, usingOraclize {

    using Conversions for address;
    using Conversions for string;

    mapping (bytes32 => address) usernameHashToAddress;
    mapping (bytes32 => Query) queries;

    function userByHash(bytes32 usernameHash) public view returns (address) {
        return usernameHashToAddress[usernameHash];
    }

    function attestationPrice() public view returns (uint) {
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        return oraclize_getPrice("URL", 400000);
    }

    function attest(string username, string gistId)
        public
        payable
        onlyCorrectPayment
    {
        string memory queryPrefix = "json(https://api.github.com/gists/";
        string memory queryPostfix = ").$..[owner,files]..[login,filename,content]";
        string memory query = strConcat(queryPrefix, gistId, queryPostfix);
        bytes32 queryId = oraclize_query("URL", query, 400000);

        queries[queryId] = Query(username, msg.sender);
    }

    function __callback(bytes32 queryId, string result, bytes)
        public
        onlyOraclize
    {
        Query storage query = queries[queryId];
        if (bytes(query.username).length != 0) {
            processQueryResult(query, result);
            delete queries[queryId];
            return;
        }
        revert("callback called for non-existent query");
    }

    function processQueryResult(Query query, string result) private {
        string memory accountString = query.account.toString();
        string memory correctResult = strConcat(
            "[\"", query.username, "\", \"attestation\", \"0x", accountString, "\"]"
        );

        if (strCompare(correctResult.toLowerCase(), result.toLowerCase()) == 0) {
            usernameHashToAddress[keccak256(bytes(query.username))] = query.account;
        }
    }

    struct Query {
        string username;
        address account;
    }

    modifier onlyOraclize {
        if (msg.sender != oraclize_cbAddress()) {
            revert("only Oraclize is allowed to call this method");
        }
        _;
    }

    modifier onlyCorrectPayment {
        if (msg.value != attestationPrice()) {
            revert("incorrect payment amount");
        }
        _;
    }
}
