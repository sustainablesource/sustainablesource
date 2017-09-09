pragma solidity^0.4.6;
import "oraclize/usingOraclize.sol";

contract PullRequests is usingOraclize {

    string repo;

    mapping (uint => string) pullRequestIdToCreator;
    mapping (uint => bool) pullRequestIdToMergedState;
    mapping (bytes32 => UserQuery) userQueries;
    mapping (bytes32 => MergedQuery) mergedQueries;

    function PullRequests(string repo_) {
        repo = repo_;
    }

    function creators(uint pullRequestId) constant returns (string creator) {
        return pullRequestIdToCreator[pullRequestId];
    }

    function isMerged(uint pullRequestId) constant returns (bool isMerged) {
        return pullRequestIdToMergedState[pullRequestId];
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

        string memory userQuery = strConcat(prefix, "user.login");
        bytes32 userQueryId = oraclize_query("URL", userQuery, 300000);
        userQueries[userQueryId] = UserQuery(pullRequestId, creator, false);

        string memory mergedQuery = strConcat(prefix, "merged");
        bytes32 mergedQueryId = oraclize_query("URL", mergedQuery, 300000);
        mergedQueries[mergedQueryId] = MergedQuery(pullRequestId, false);
    }

    function __callback(bytes32 queryId, string result, bytes) onlyOraclize {
        UserQuery userQuery = userQueries[queryId];
        if (userQuery.isProcessed) {
            throw;
        }
        if (userQuery.pullRequestId != 0) {
            processUserResult(userQuery, result);
            userQuery.isProcessed = true;
        }

        MergedQuery mergedQuery = mergedQueries[queryId];
        if (mergedQuery.isProcessed) {
            throw;
        }
        if (mergedQuery.pullRequestId != 0) {
            processMergedStateResult(mergedQuery, result);
            mergedQuery.isProcessed = true;
        }
    }

    function processUserResult(UserQuery query, string result)
        private
    {
        string memory correctResult = strConcat("[\"", query.creator, "\"]");
        if (strCompare(correctResult, result) == 0) {
            pullRequestIdToCreator[query.pullRequestId] = query.creator;
        }
    }

    function processMergedStateResult(MergedQuery query, string result)
        private
    {
        string memory correctResult = "[true]";
        if (strCompare(correctResult, result) == 0) {
            pullRequestIdToMergedState[query.pullRequestId] = true;
        }
    }

    function queryPrefix(uint pullRequestId)
        private
        returns (string)
    {
        return strConcat(
            "json(https://api.github.com/",
            repo,
            "/pulls/",
             uint2str(pullRequestId),
            ")."
        );
    }

    struct UserQuery {
        uint pullRequestId;
        string creator;
        bool isProcessed;
    }

    struct MergedQuery {
        uint pullRequestId;
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
