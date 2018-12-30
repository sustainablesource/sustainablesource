pragma solidity^0.5.0;
import "./oraclize/usingOraclize.sol";
import "./PullRequestsInterface.sol";

contract PullRequests is PullRequestsInterface, usingOraclize {

    string repo;

    mapping (uint => string) pullRequestIdToCreator;
    mapping (uint => bool) pullRequestIdToMergedState;
    mapping (bytes32 => UserQuery) userQueries;
    mapping (bytes32 => MergedQuery) mergedQueries;

    constructor(string memory repo_) public {
        repo = repo_;
    }

    function creator(uint pullRequestId) public view returns (string memory) {
        return pullRequestIdToCreator[pullRequestId];
    }

    function isMerged(uint pullRequestId) public view returns (bool) {
        return pullRequestIdToMergedState[pullRequestId];
    }

    function registrationPrice() public returns (uint) {
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        return 2 * oraclize_getPrice("URL", 300000);
    }

    function register(uint pullRequestId, string memory creator_)
        public
        payable
        onlyCorrectPayment
    {
        string memory prefix = queryPrefix(pullRequestId);

        string memory userQuery = strConcat(prefix, "user.login");
        bytes32 userQueryId = oraclize_query("URL", userQuery, 300000);
        userQueries[userQueryId] = UserQuery(pullRequestId, creator_);

        string memory mergedQuery = strConcat(prefix, "merged");
        bytes32 mergedQueryId = oraclize_query("URL", mergedQuery, 300000);
        mergedQueries[mergedQueryId] = MergedQuery(pullRequestId);
    }

    function __callback(bytes32 queryId, string memory result, bytes memory)
        public
        onlyOraclize
    {
        UserQuery storage userQuery = userQueries[queryId];
        if (userQuery.pullRequestId != 0) {
            processUserResult(userQuery, result);
            delete userQueries[queryId];
            return;
        }

        MergedQuery storage mergedQuery = mergedQueries[queryId];
        if (mergedQuery.pullRequestId != 0) {
            processMergedStateResult(mergedQuery, result);
            delete mergedQueries[queryId];
            return;
        }

        revert("result to unknown query");
    }

    function processUserResult(UserQuery storage query, string memory result)
        private
    {
        string memory correctResult = query.creator;
        if (strCompare(correctResult, result) == 0) {
            pullRequestIdToCreator[query.pullRequestId] = query.creator;
        }
    }

    function processMergedStateResult(
        MergedQuery storage query,
        string memory result
    )
        private
    {
        string memory correctResult = "true";
        if (strCompare(correctResult, result) == 0) {
            pullRequestIdToMergedState[query.pullRequestId] = true;
        }
    }

    function queryPrefix(uint pullRequestId)
        private
        view
        returns (string memory)
    {
        return strConcat(
            "json(https://api.github.com/repos/",
            repo,
            "/pulls/",
            uint2str(pullRequestId),
            ")."
        );
    }

    struct UserQuery {
        uint pullRequestId;
        string creator;
    }

    struct MergedQuery {
        uint pullRequestId;
    }

    modifier onlyOraclize {
        if (msg.sender != oraclize_cbAddress()) {
            revert("only Oraclize is allowed to call this function");
        }
        _;
    }

    modifier onlyCorrectPayment {
        if (msg.value != registrationPrice()) {
            revert("incorrect payment");
        }
        _;
    }
}
