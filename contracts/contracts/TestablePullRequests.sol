pragma solidity^0.5.0;
import "./PullRequests.sol";
import "@sustainablesource/provable/contracts/ProvableSpy.sol";

contract TestablePullRequests is PullRequests, ProvableSpy {
    constructor(string memory repo) PullRequests(repo) public {
    }
}
