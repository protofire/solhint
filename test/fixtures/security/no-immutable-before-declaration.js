// cSpell:disable

const CODE = `
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/*
  EXPECTATIONS for rule no-immutable-before-declaration:

  Contract ImmutablesOrderExamples:
    - constA uses constB declared later        -> OK (constants are compile-time)
    - immA uses immB declared later            -> WARNING (immB is immutable, declared after)
    - immC uses immD declared earlier          -> OK (correct order)
    - usesImmLate uses immLate declared later  -> WARNING (even though usesImmLate is not immutable)

  Contract ImmutablesWithInheritance:
    - baseImmutable declared in Base           -> OK to use in Child initializers (out of scope)
*/

/// @title Examples mixing constants and immutables with different declaration orders
contract ImmutablesOrderExamples {
    // CASE 1: Constants can be referenced before declaration
    // constA correctly uses constB even though constB is declared later
    uint256 public constA = constB + 100;     // EXPECT: OK (constB is constant)
    uint256 internal constant constB = 50;    // Constants are compile-time values

    // CASE 2: Immutables cannot be safely used before declaration
    // immA tries to use immB before immB is declared - this is suspicious
    uint256 public immA = immB + 100;         // EXPECT: WARNING (immB declared later)
    uint256 internal immutable immB = 25;     // immB isn't available with its final value at immA init

    // CASE 3: Correct order for immutables
    // Declare immutables first, then use them
    uint256 internal immutable immD = 75;     // Declare immutable first
    uint256 public immC = immD + 100;         // EXPECT: OK (immD declared before)

    // CASE 4: Non-immutable using immutable declared later (also dangerous)
    uint256 public usesImmLate = immLate + 1; // EXPECT: WARNING (immLate declared later)
    uint256 internal immutable immLate = 5;

    constructor() {
        // Runtime checks to clarify behavior (not used by the rule, just documentation)
        assert(constA == 150);
        assert(immC == 175);
        // immA will actually be 100 (immB default 0 at init), not 125
        // usesImmLate will be 1 (immLate default 0), not 6
    }
}

/// @title Using inherited immutables (out of scope for this rule)
contract BaseWithImmutable {
    uint256 internal immutable baseImmutable = 42;
}

contract ChildUsingBaseImmutable is BaseWithImmutable {
    // Using baseImmutable here is OK for this rule:
    // - The rule only checks immutables declared in the SAME contract.
    uint256 public derivedValue = baseImmutable + 1; // EXPECT: OK (no warning)
}
`

module.exports = CODE
