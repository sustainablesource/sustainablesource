pragma solidity^0.4.6;
import "oraclize/usingOraclize.sol";

contract PullRequests is usingOraclize {

    string repo;

    function PullRequests(string repo_) {
        repo = repo_;
    }

    function register(uint pullRequestId) {
        string memory prefix = "json(https://api.github.com/";
        string memory infix = "/pulls/";
        string memory postfix = ").user.login";
        string memory id = uint2str(pullRequestId);
        string memory query = strConcat(prefix, repo, infix, id, postfix);
        oraclize_query("URL", query, 0);
    }
}
