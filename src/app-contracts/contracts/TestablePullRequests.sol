pragma solidity^0.4.6;
import "./PullRequests.sol";
import "./OraclizeSpy.sol";

contract TestablePullRequests is PullRequests, OraclizeSpy {
    function TestablePullRequests(string repo) PullRequests(repo){
    }
}
