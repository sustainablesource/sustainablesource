pragma solidity^0.4.6;
import "oraclize/usingOraclize.sol";

contract PullRequests is usingOraclize {

    string repo;

    function PullRequests(string repo_) {
        repo = repo_;
    }

    function register(uint pullRequestId) {
        string memory prefix = queryPrefix(pullRequestId);
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        oraclize_query("URL", strConcat(prefix, "user.login"), 0);
        oraclize_query("URL", strConcat(prefix, "merged"), 0);
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
}
