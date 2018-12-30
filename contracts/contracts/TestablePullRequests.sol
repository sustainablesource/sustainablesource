pragma solidity^0.5.0;
import "./PullRequests.sol";
import "@sustainablesource/oraclize-spy/contracts/OraclizeSpy.sol";

contract TestablePullRequests is PullRequests, OraclizeSpy {
    constructor(string memory repo) PullRequests(repo) public {
    }
}
