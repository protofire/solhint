// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract FallbackNoReceive1 {
    constructor() {}

    function anyFunction() {}

    function() public {}

    function() {
        uint256 anUintToFillSpace;
    }

    function() external onlyOwner {}

    function() virtual {
        uint256 anUintToFillSpace;
    }

    //// fallback explicit
    fallback() external {}

    fallback() external {
        uint256 anUintToFillSpace;
    }

    fallback() external onlyOwner {
        uint256 anUintToFillSpace;
    }

    fallback() external virtual {}

    fallback() external payable {}
    function() external payable {}
}

contract FallbackWithReceive {
    constructor() {}

    function() {
        uint256 anUintToFillSpace;
    }

    function() external onlyOwner {}

    fallback() external {
        uint256 anUintToFillSpace;
    }

    receive() external payable onlyOwner {}
}

contract FallbackNoReceive2 {
    constructor() {}

    function() {
        uint256 anUintToFillSpace;
    }

    function() external onlyOwner {}

    fallback() external {
        uint256 anUintToFillSpace;
    }
}
