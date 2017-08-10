pragma solidity^0.4.6;
import "oraclize/usingOraclize.sol";

contract PullRequests is usingOraclize {

    string repo;

    function PullRequests(string repo_) {
        repo = repo_;
    }

    function registrationPrice() constant returns (uint) {
        return 2 * oraclize_getPrice('URL', 300000);
    }

    function register(uint pullRequestId) payable onlyCorrectPayment {
        string memory prefix = queryPrefix(pullRequestId);
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        oraclize_query("URL", strConcat(prefix, "user.login"), 300000);
        oraclize_query("URL", strConcat(prefix, "merged"), 300000);
    }

    function __callback(bytes32 queryId, string result, bytes) onlyOraclize {
    }

    function queryPrefix(uint pullRequestId) private returns (string) {
        return strConcat(
            "json(https://api.github.com/",
            repo,
            "/pulls/",
             uint2str(pullRequestId),
            ")."
        );
    }

    modifier onlyOraclize {
        if (msg.sender != oraclize_cbAddress()) {
            throw;
        }
        _;
    }

    modifier onlyCorrectPayment {
        if (msg.value != registrationPrice()) {
            throw;
        }
        _;
    }
}
