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

    function attest(string username, string gistId) {
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);

        string memory queryPrefix = "json(https://api.github.com/gists/";
        string memory queryPostfix = ").$..[owner,files]..[login,filename,content]";
        string memory query = strConcat(queryPrefix, gistId, queryPostfix);
        bytes32 queryId = oraclize_query("URL", query);

        queries[queryId] = Query(username, msg.sender);
    }

    function __callback(bytes32 queryId, string result, bytes) onlyOraclize {
        Query query = queries[queryId];
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
    }

    modifier onlyOraclize {
        if (msg.sender != oraclize_cbAddress()) {
            throw;
        }
        _;
    }
}
