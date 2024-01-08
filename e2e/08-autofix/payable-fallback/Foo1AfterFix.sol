// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract Generic {
    
    constructor()  {}

    function anyFunction() {}

    //// fallback with receive
    receive() payable public {}
    
    receive() payable external onlyOwner {}

    receive() payable external virtual {
        uint256 anUintToFillSpace;
    }

    //// fallback with no name
    function() payable public {}

    function() payable {
        uint256 anUintToFillSpace;
    }

    function() payable external onlyOwner {}

    function() payable virtual {
        uint256 anUintToFillSpace;
    }


    //// fallback explicit
    fallback() payable {}

    fallback() payable {
        uint256 anUintToFillSpace;
    }

    fallback() payable external onlyOwner{
        uint256 anUintToFillSpace;
    }

    fallback() payable virtual {}


    fallback() external payable {}
    function() external payable {}    
    receive() public virtual payable {}
}
