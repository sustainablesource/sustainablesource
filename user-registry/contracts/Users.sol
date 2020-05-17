pragma solidity ^0.5.0;
import "./UsersInterface.sol";

contract Users is UsersInterface {

    uint public attestationPrice;

    address oracleAddress;
    uint nextOracleRequestId;
    mapping (uint => OracleRequest) oracleRequests;

    mapping (bytes32 => address) usernameHashToAddress;

    constructor(uint attestationPrice_, address oracleAddress_) public {
        attestationPrice = attestationPrice_;
        oracleAddress = oracleAddress_;
    }

    function oracleRequest(uint requestId)
        public
        view
        returns (string memory, address)
    {
        OracleRequest storage request = oracleRequests[requestId];
        return (request.gistId, request.account);
    }

    function userByHash(bytes32 usernameHash) public view returns (address) {
        return usernameHashToAddress[usernameHash];
    }

    function attest(string memory gistId)
        public
        payable
        onlyCorrectPayment
    {
        uint requestId = nextOracleRequestId++;
        oracleRequests[requestId] = OracleRequest(gistId, msg.sender);
        emit OracleRequestStored(requestId);
    }

    function oracleResponse(uint requestId, bool attestationIsCorrect,
                            string memory username)
        public
        onlyOracle
    {
        OracleRequest storage request = oracleRequests[requestId];
        if (bytes(request.gistId).length == 0) {
            revert("response received for non-existing request");
        }
        if (attestationIsCorrect) {
            usernameHashToAddress[keccak256(bytes(username))] = request.account;
        }
        delete oracleRequests[requestId];
    }

    struct OracleRequest {
        string gistId;
        address account;
    }

    event OracleRequestStored (
        uint requestId
    );

    modifier onlyOracle {
        if (msg.sender != oracleAddress) {
            revert("only the oracle is allowed to call this method");
        }
        _;
    }

    modifier onlyCorrectPayment {
        if (msg.value != attestationPrice) {
            revert("incorrect payment amount");
        }
        _;
    }
}
