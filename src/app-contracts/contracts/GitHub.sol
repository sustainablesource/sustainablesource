pragma solidity ^0.4.8;
import "oraclize/usingOraclize.sol";

contract GitHub is usingOraclize {

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

    function __callback(bytes32 queryId, string result, bytes proof) {
        Query query = queries[queryId];
        usernameToAddress[query.username] = query.account;
    }

    struct Query {
        string username;
        address account;
    }
}
