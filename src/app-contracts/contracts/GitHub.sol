pragma solidity ^0.4.8;
import "oraclize/usingOraclize.sol";

contract GitHub is usingOraclize {

    function attest(string gistId) {
        string memory queryPrefix = "json(https://api.github.com/gists/";
        string memory queryPostfix = ").$..[owner,files]..[login,filename,content]";
        string memory query = strConcat(queryPrefix, gistId, queryPostfix);
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        oraclize_query("URL", query);
    }
}
