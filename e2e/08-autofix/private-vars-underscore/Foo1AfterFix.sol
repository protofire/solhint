pragma solidity 0.8.0;

library libraryName {
    uint256 internal lzarasa1;
    uint256 internal lzarasa2 = 2;
    uint256 internal _lzarasa3;
    uint256 private lzarasa4;
    uint256 private lzarasa5 = 5;
    uint256 private _lzarasa6;

    uint256 public _lzarasa7;
    uint256 public _lzarasa8 = 8;
    uint256 public lzarasa9;

    function fofo1() public {}
    function _fofo2() public {}
    function _fofo3() internal {}
    function fofo4() internal {}
}

contract Foo1 {
    uint256 internal _zarasa1;
    uint256 internal _zarasa2 = 2;
    uint256 internal _zarasa3;
    uint256 private _zarasa4;
    uint256 private _zarasa5 = 5;
    uint256 private _zarasa6;

    uint256 public zarasa7;
    uint256 public zarasa8 = 8;
    uint256 public zarasa9;

    address payable internal constant _zarasa10 = '0x0';
    address public constant zarasa11 = '0x0';
    uint256 public immutable zarasa12 = 2;
    uint256 _zarasa13;
    uint256 _zarasa14;

    mapping(address => uint256) internal _zarMapping1;
    mapping(address => uint256) public zarMapping2;
    mapping(address => uint256) internal _zarMapping3;
    mapping(address => uint256) public zarMapping4;

    function _fooA(uint bar) internal payable onlyOwner returns (uint256 barA) {
        uint256 zarasaFunc;
    }

    function _fooB(uint bar) private onlyOwner returns (uint256 _barB) {
        uint256 zarasaFunc;
    }

    function _fooC(uint bar) private onlyOwner returns (uint256 _barC) {
        uint256 zarasaFunc;
    }

    function fooD(uint bar) external onlyOwner {
        uint256 zarasaFunc;
    }

    function fooE(uint bar) public onlyOwner {
        uint256 zarasaFunc;
    }

    function _fooF(uint bar) onlyOwner returns (uint256 _barF) {
        uint256 zarasaFunc;
    }

    function _fooG(uint bar) onlyOwner {
        uint256 zarasaFunc;
    }

    function fooH(uint bar) external onlyOwner {
        uint256 zarasaFunc;
    }

    function fooI(uint bar) public onlyOwner {
        uint256 zarasaFunc;
    }

    function _fooJ(uint bar) onlyOwner returns (uint256 barJ) {
        uint256 zarasaFunc;
    }
}
