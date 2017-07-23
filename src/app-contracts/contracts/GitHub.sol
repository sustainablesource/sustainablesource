pragma solidity ^0.4.8;
import "oraclize/usingOraclize.sol";
import "./Conversions.sol";

contract GitHub is usingOraclize {

    using Conversions for address;

    mapping (string => address) usernameToAddress;
    mapping (bytes32 => Query) queries;

    function users(string username) constant returns (address account) {
        return usernameToAddress[username];
    }

    function attestationPrice() constant returns (uint) {
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        return oraclize_getPrice('URL', 400000);
    }

    function attest(string username, string gistId) payable onlyCorrectPayment {
        string memory queryPrefix = "json(https://api.github.com/gists/";
        string memory queryPostfix = ").$..[owner,files]..[login,filename,content]";
        string memory query = strConcat(queryPrefix, gistId, queryPostfix);
        bytes32 queryId = oraclize_query("URL", query, 400000);

        queries[queryId] = Query(username, msg.sender, false);
    }

    function __callback(bytes32 queryId, string result, bytes) onlyOraclize {
        Query query = queries[queryId];
        if (query.isProcessed) {
            throw;
        }

        processQueryResult(query, result);

        query.isProcessed = true;
    }

    function processQueryResult(Query query, string result) private {
        string memory accountString = query.account.toString();
        string memory correctResult = strConcat(
            "[\"", query.username, "\", \"attestation\", \"0x", accountString, "\"]"
        );

        if (strCompare(correctResult, result) == 0) {
            usernameToAddress[query.username] = query.account;
        }
    }

    struct Query {
        string username;
        address account;
        bool isProcessed;
    }

    modifier onlyOraclize {
        if (msg.sender != oraclize_cbAddress()) {
            throw;
        }
        _;
    }

    modifier onlyCorrectPayment {
        if (msg.value != attestationPrice()) {
            throw;
        }
        _;
    }
}
