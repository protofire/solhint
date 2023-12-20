// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract Generic {
    
    constructor()  {}

    function anyFunction() {}

    //// fallback with receive
    receive() public {}
    
    receive() external onlyOwner {}

    receive() external virtual {
        uint256 anUintToFillSpace;
    }

    //// fallback with no name
    function() public {}

    function() {
        uint256 anUintToFillSpace;
    }

    function() external onlyOwner {}

    function() virtual {
        uint256 anUintToFillSpace;
    }


    //// fallback explicit
    fallback() {}

    fallback() {
        uint256 anUintToFillSpace;
    }

    fallback() external onlyOwner{
        uint256 anUintToFillSpace;
    }

    fallback() virtual {}


    fallback() external payable {}
    function() external payable {}    
    receive() public virtual payable {}
}
