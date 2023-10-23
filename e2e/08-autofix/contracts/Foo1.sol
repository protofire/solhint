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

    function fofo() public {}
    function _fofo() public {}
    function _fofo() internal {}
    function fofo() internal {}
}

contract Foo1 {
    uint256 internal zarasa1;
    uint256 internal zarasa2 = 2;
    uint256 internal _zarasa3;
    uint256 private zarasa4;
    uint256 private zarasa5 = 5;
    uint256 private _zarasa6;

    uint256 public _zarasa7;
    uint256 public _zarasa8 = 8;
    uint256 public zarasa9;

    address payable internal constant zarasa10 = '0x0';
    address public constant _zarasa11 = '0x0';
    uint256 public immutable _zarasa12 = 2;
    uint256 _zarasa13;
    uint256 zarasa14;

    mapping(address => uint256) internal zarMapping1;
    mapping(address => uint256) public _zarMapping2;
    mapping(address => uint256) internal _zarMapping3;
    mapping(address => uint256) public zarMapping4;

    function fooA(uint bar) internal payable onlyOwner returns (uint256 barA) {
        uint256 zarasaFunc;
    }

    function fooB(uint bar) private onlyOwner returns (uint256 _barB) {
        uint256 zarasaFunc;
    }

    function fooC(uint bar) private onlyOwner returns (uint256 _barC) {
        uint256 zarasaFunc;
    }

    function fooD(uint bar) external onlyOwner {
        uint256 zarasaFunc;
    }

    function fooE(uint bar) public onlyOwner {
        uint256 zarasaFunc;
    }

    function fooF(uint bar) onlyOwner returns (uint256 _barF) {
        uint256 zarasaFunc;
    }

    function fooG(uint bar) onlyOwner {
        uint256 zarasaFunc;
    }

    function _fooH(uint bar) external onlyOwner {
        uint256 zarasaFunc;
    }

    function _fooI(uint bar) public onlyOwner {
        uint256 zarasaFunc;
    }

    function _fooJ(uint bar) onlyOwner returns (uint256 barJ) {
        uint256 zarasaFunc;
    }
}
