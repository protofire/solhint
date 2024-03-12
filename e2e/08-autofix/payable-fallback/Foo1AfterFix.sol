// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract FallbackNoReceive1 {
    constructor() {}

    function anyFunction() {}

    function() payable public {}

    function() payable {
        uint256 anUintToFillSpace;
    }

    function() payable external onlyOwner {}

    function() payable virtual {
        uint256 anUintToFillSpace;
    }

    //// fallback explicit
    fallback() payable external {}

    fallback() payable external {
        uint256 anUintToFillSpace;
    }

    fallback() payable external onlyOwner {
        uint256 anUintToFillSpace;
    }

    fallback() payable external virtual {}

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

    function() payable {
        uint256 anUintToFillSpace;
    }

    function() payable external onlyOwner {}

    fallback() payable external {
        uint256 anUintToFillSpace;
    }
}
