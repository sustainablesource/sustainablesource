pragma solidity^0.4.6;
import "oraclize/usingOraclize.sol";

contract PullRequests is usingOraclize {

    string repo;

    mapping (uint => string) pullRequestIdToCreator;
    mapping (bytes32 => UsernameQuery) usernameQueries;

    function PullRequests(string repo_) {
        repo = repo_;
    }

    function creators(uint pullRequestId) constant returns (string creator) {
        return pullRequestIdToCreator[pullRequestId];
    }

    function registrationPrice() constant returns (uint) {
        return 2 * oraclize_getPrice('URL', 300000);
    }

    function register(uint pullRequestId, string creator)
        payable
        onlyCorrectPayment
    {
        string memory prefix = queryPrefix(pullRequestId);
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);

        string memory usernameQuery = strConcat(prefix, "user.login");
        bytes32 usernameQueryId = oraclize_query("URL", usernameQuery, 300000);
        usernameQueries[usernameQueryId] = UsernameQuery(pullRequestId, creator, false);

        oraclize_query("URL", strConcat(prefix, "merged"), 300000);
    }

    function __callback(bytes32 queryId, string result, bytes) onlyOraclize {
        UsernameQuery query = usernameQueries[queryId];
        if (query.isProcessed) {
            throw;
        }

        processUsernameResult(query, result);

        query.isProcessed = true;
    }

    function processUsernameResult(UsernameQuery query, string result) private {
        string memory correctResult = strConcat("[\"", query.creator, "\"]");
        if (strCompare(correctResult, result) == 0) {
            pullRequestIdToCreator[query.pullRequestId] = query.creator;
        }
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

    struct UsernameQuery {
        uint pullRequestId;
        string creator;
        bool isProcessed;
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
