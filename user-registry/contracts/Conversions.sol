pragma solidity ^0.5.0;

library Conversions {
    function toString(address addr) internal pure returns (string memory) {
        bytes memory result = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(addr) / (2**(8*(19 - i)))));
            byte high = byte(uint8(b) / 16);
            byte low = byte(uint8(b) - 16 * uint8(high));
            result[2*i] = toHex(high);
            result[2*i+1] = toHex(low);
        }
        return string(result);
    }

    function toLowerCase(string memory str)
        internal
        pure
        returns (string memory)
    {
        bytes memory input = bytes(str);
        bytes memory output = new bytes(input.length);
        for (uint i = 0; i < input.length; i++) {
            uint8 character = uint8(input[i]);
            if (0x41 <= character && character <= 0x5A) {
                character += 0x20;
            }
            output[i] = byte(character);
        }
        return string(output);
    }

    function toHex(byte b) private pure returns (byte c) {
        uint8 asciiOffset = uint8(b) < 10 ? 0x30 : 0x57;
        return byte(uint8(b) + asciiOffset);
    }
}
