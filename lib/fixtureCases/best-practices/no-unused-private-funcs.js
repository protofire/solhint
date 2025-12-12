// cSpell:disable

const CODE = `
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/*
  EXPECTATIONS (for the no-unused-private-vars rule):

  Contract PrivateFuncBasic:
    - _neverCalled()              -> UNUSED (warning)
    - _usedOnce()                 -> USED
    - _usedMultipleTimes()        -> USED

  Contract PrivateFuncConstructor:
    - _initValue()                -> USED (called from the constructor)

  Contract PrivateFuncRecursion:
    - _factorial(uint256)         -> USED (direct recursion)
    - _isEven(uint256)            -> USED (mutual with _isOdd)
    - _isOdd(uint256)             -> USED (mutual with _isEven)
    - _neverMutual()              -> UNUSED (warning)

  Contract PrivateFuncOverloads:
    - _overload()                 -> USED
    - _overload(uint256)          -> USED
    - _overload(bytes32)          -> UNUSED (warning, according to the ideal rule; with the simplified version
                                        that marks by name, it might NOT warn)

  Abstract contract AbstractWithPrivate:
    - _helper()                   -> UNUSED (warning; no calls possible from children)
  Contract ChildOfAbstract:
    - no funciones private

  Contract PrivateInModifier:
    - _bump()                     -> USED (only inside the modifier)

  Library PrivateLib:
    - _usedInLib(uint256)         -> USED (called from publicWrapper)
    - _unusedInLib(uint256)       -> UNUSED (warning)
*/

/// @title Basic cases: used / unused private functions in a plain contract
contract PrivateFuncBasic {
    // EXPECT: UNUSED
    function _neverCalled() private pure {
        // dead code
    }

    // EXPECT: USED
    function _usedOnce() private pure returns (uint256) {
        return 1;
    }

    // EXPECT: USED (usada más de una vez)
    function _usedMultipleTimes() private pure returns (uint256) {
        return 2;
    }

    function entry() external pure returns (uint256) {
        uint256 x = _usedOnce();
        x += _usedMultipleTimes();
        x += _usedMultipleTimes();
        return x;
    }
}

/// @title Usage in constructor
contract PrivateFuncConstructor {
    uint256 public value;

    // EXPECT: USED (called from the constructor)
    function _initValue() private returns (uint256) {
        value = 123;
        return value;
    }

    constructor() {
        _initValue();
    }
}

/// @title Direct and mutual recursion, and a dead private function
contract PrivateFuncRecursion {
    // EXPECT: USED (direct recursion)
    function _factorial(uint256 n) private pure returns (uint256) {
        if (n == 0) return 1;
        return n * _factorial(n - 1);
    }

    // EXPECT: USED (mutual with _isOdd)
    function _isEven(uint256 n) private pure returns (bool) {
        if (n == 0) return true;
        return _isOdd(n - 1);
    }

    // EXPECT: USED (mutual with _isEven)
    function _isOdd(uint256 n) private pure returns (bool) {
        if (n == 0) return false;
        return _isEven(n - 1);
    }

    // EXPECT: UNUSED
    function _neverMutual() private pure returns (uint256) {
        return 42;
    }

    function check(uint256 n) external pure returns (uint256, bool) {
        return (_factorial(n), _isEven(n));
    }
}

/// @title Private overloads: some used, some not
contract PrivateFuncOverloads {
    // EXPECT: USED
    function _overload() private pure returns (uint256) {
        return 100;
    }

    // EXPECT: USED
    function _overload(uint256 x) private pure returns (uint256) {
        return x + 1;
    }

    // EXPECT: UNUSED
    function _overload(bytes32) private pure returns (uint256) {
        return 999;
    }

    function callAll() external pure returns (uint256) {
        uint256 r = _overload();
        r += _overload(5);
        // we never call the overload(bytes32)
        return r;
    }
}

/// @title Abstract contract with private functions that children CANNOT use
abstract contract AbstractWithPrivate {
    // EXPECT: UNUSED (no way to use it from children)
    function _helper() private pure returns (uint256) {
        return 5;
    }

    function mustImplement() public virtual;
}

contract ChildOfAbstract is AbstractWithPrivate {
    function mustImplement() public override {
        // cannot call _helper(), as it is private
    }
}

/// @title Private used inside a modifier
contract PrivateInModifier {
    uint256 private _counter;

    // EXPECT: USED (only inside the modifier)
    function _bump() private {
        _counter++;
    }

    modifier autoBump() {
        _bump();
        _;
    }

    function doSomething() external autoBump {
        // something
    }

    function readCounter() external view returns (uint256) {
        return _counter;
    }
}

/// @title Library with private functions
library PrivateLib {
    // EXPECT: USED
    function _usedInLib(uint256 x) private pure returns (uint256) {
        return x + 1;
    }

    // EXPECT: UNUSED
    function _unusedInLib(uint256 x) private pure returns (uint256) {
        return x * 2;
    }

    function publicWrapper(uint256 x) internal pure returns (uint256) {
        return _usedInLib(x);
    }
}

contract UsesLib {
    function f(uint256 x) external pure returns (uint256) {
        return PrivateLib.publicWrapper(x);
    }
}
`

module.exports = CODE
