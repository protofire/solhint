const assert = require('assert')
const linter = require('../../../lib/index')
const { assertNoErrors, assertErrorMessage, assertErrorCount } = require('../../common/asserts')

describe('Linter - use-natspec', () => {
  it('should detect missing @title and @author and @notice in contract', () => {
    const code = `
      contract MyContract {
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertErrorCount(report, 3)
    assert.ok(report.reports[0].message, "Missing @title tag in contract 'MyContract'")
    assert.ok(report.reports[1].message, "Missing @author tag in contract 'MyContract'")
    assert.ok(report.reports[2].message, "Missing @notice tag in contract 'MyContract'")
  })

  it('should not fail if @inheritdoc is present for public function', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice Some notice
      contract C {
        /// @inheritdoc D
        function x() external {}
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertNoErrors(report)
  })

  it('should fail if @param names do not match Solidity param names', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice Some notice
      contract C {
        /// @notice test
        /// @param wrongName description
        function f(uint256 rightName) external {}
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertErrorMessage(
      report,
      "Mismatch in @param names for function 'f'. Expected: [rightName], Found: [wrongName]"
    )
  })

  it('should not validate names when parameters are unnamed', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice Some notice
      contract C {
        /// @notice test
        /// @param description
        function f(uint256) external {}
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertNoErrors(report)
  })

  it('should validate @return with unnamed return value', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice Some notice
      contract C {
        /// @notice test
        /// @return description
        function f() external pure returns (uint256) {
          return 1;
        }
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertNoErrors(report)
  })

  it('should error when return is named and not documented', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice Some notice
      contract C {
        /// @notice test
        function f() external pure returns (uint256 val) {
          return val;
        }
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assert.ok(report.reports[0].message, "Missing @return tag in function 'f'")
    assert.ok(
      report.reports[1].message,
      "Mismatch in @return names for function 'f'. Expected: [val], Found: []"
    )
  })

  it('should handle multiple @param and @return correctly', () => {
    const code = `
      /// @title Example
      /// @author User
      /// @notice Does something
      contract Test {
        /// @notice Multi param
        /// @param a First
        /// @param b Second
        /// @return x Description
        /// @return y Description
        function multi(uint a, uint b) external pure returns (uint x, uint y) {
          return (a, b);
        }
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertNoErrors(report)
  })

  it('should ignore variables that are not public', () => {
    const code = `
      /**
       * @title Example
       * @author User
       * @notice Does something
       */
      contract MyContract {
        uint256 internal secret;
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertNoErrors(report)
  })

  it('should require @notice for public state variables', () => {
    const code = `
      /**
       * @title Example
       * @author User
       * @notice Does something
       */
      contract MyContract {
        uint256 public value;
      }
    `

    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertErrorMessage(report, "Missing @notice tag in variable 'value'")
  })

  it('should fail when natspec @param tags does not match Solidity parameters', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice test
      contract C {
        /// @notice does something
        /// @param a description
        /// @param b description
        function test(uint a) external {}
      }
    `
    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertErrorMessage(
      report,
      "Mismatch in @param names for function 'test'. Expected: [a], Found: [a, b]"
    )
  })

  it('should fail when natspec @param tags quantity does not match Solidity parameters', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice test
      contract C {
        /// @notice does something
        /// @param description
        function test(uint, uint) external {}
      }
    `
    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertErrorMessage(
      report,
      "Mismatch in @param count for function 'test'. Expected: 2, Found: 1"
    )
  })

  it('should pass when unnamed Solidity params match @param count', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice test
      contract C {
        /// @notice does something
        /// @param description
        function test(uint) external {}
      }
    `
    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertNoErrors(report)
  })

  it('should handle return parameters correctly when natspec does not describe them', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice test
      contract C {
        /// @notice does something
        /// @return amount1 description
        function test() external pure returns (uint256 amount1, uint256 amount2) {
          return (1, amount);
        }
      }
    `
    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertErrorMessage(
      report,
      "Mismatch in @return names for function 'test'. Expected: [amount1, amount2], Found: [amount1]"
    )
  })

  it('should fail when one named return is undocumented', () => {
    const code = `
      /// @title A
      /// @author B
      /// @notice test
      contract C {
        /// @notice does something
        /// @return amount description
        function test() external pure returns (uint256, uint256 amount) {
          return (1, amount);
        }
      }
    `
    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertErrorMessage(
      report,
      "Mismatch in @return count for function 'test'. Expected: 2, Found: 1"
    )
  })

  it('should ignore function if @inheritdoc is present', () => {
    const code = `
      /**
       * @title Interface
       * @author Me
       * @notice Interface notice
       */
      interface I {
        /// @notice Function x
        /// @param p1 Parameter 1
        function x() external;
      }

      /// @title Impl
      /// @author Me
      /// @notice Impl notice
      contract C is I {
        /// @inheritdoc I
        function x() external {}
      }
    `
    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assertNoErrors(report)
  })

  it('should require title/author/notice in library', () => {
    const code = `
      library MyLib {}
    `
    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assert.ok(report.reports[0].message, "Missing @title tag in library 'MyLib'")
    assert.ok(report.reports[1].message, "Missing @author tag in library 'MyLib'")
    assert.ok(report.reports[2].message, "Missing @notice tag in library 'MyLib'")
  })

  it('should require tags in interface', () => {
    const code = `
      interface MyInterface {}
    `
    const report = linter.processStr(code, {
      rules: { 'use-natspec': 'error' },
    })

    assert.ok(report.reports[0].message, "Missing @title tag in interface 'MyInterface'")
    assert.ok(report.reports[1].message, "Missing @author tag in interface 'MyInterface'")
    assert.ok(report.reports[2].message, "Missing @notice tag in interface 'MyInterface'")
  })

  /// ///////////////////////////////////////////////////////////////
  /// //////////////////// Configuration //////////////////////////////
  /// ///////////////////////////////////////////////////////////////

  describe('==> use-natspec - Configuration rule', () => {
    it('should ignore @title for contract using per-type ignore list', () => {
      const code = `
                    contract IgnoreTitle {
                    }
                    `

      const report = linter.processStr(code, {
        rules: {
          'use-natspec': [
            'error',
            {
              title: {
                enabled: true,
                ignore: {
                  contract: ['IgnoreTitle'],
                },
              },
              author: {
                enabled: true,
              },
              notice: {
                enabled: true,
              },
            },
          ],
        },
      })

      assertErrorCount(report, 2)
      assert.ok(report.reports[0].message, "Missing @author tag in contract 'IgnoreTitle'")
      assert.ok(report.reports[1].message, "Missing @notice tag in contract 'IgnoreTitle'")
    })

    it('should ignore all tags globally for a contract and interface using "*" ignore', () => {
      const code = `
                    interface IgnoreAllTags {
                    }
                    contract LegacyContract {
                    }
                    `

      const report = linter.processStr(code, {
        rules: {
          'use-natspec': [
            'error',
            {
              title: { enabled: true, ignore: { '*': ['LegacyContract', 'IgnoreAllTags'] } },
              author: { enabled: true, ignore: { '*': ['LegacyContract', 'IgnoreAllTags'] } },
              notice: { enabled: true, ignore: { '*': ['LegacyContract', 'IgnoreAllTags'] } },
            },
          ],
        },
      })

      assertNoErrors(report)
    })

    it('should ignore @notice tag for one variable using ignore.variable', () => {
      const code = `
                    /// @title Config Test
                    /// @author User
                    /// @notice This contract is for testing purposes
                    contract ConfigTest {
                      uint256 public ignoredVariable;
                      uint256 public normalVariable;
                    }
                  `

      const report = linter.processStr(code, {
        rules: {
          'use-natspec': [
            'error',
            {
              notice: {
                enabled: true,
                ignore: {
                  variable: ['ignoredVariable'],
                },
              },
            },
          ],
        },
      })

      assertErrorCount(report, 1)
      assertErrorMessage(report, "Missing @notice tag in variable 'normalVariable'")
    })

    it('should ignore @param for specific function using ignore.function', () => {
      const code = `
                    /**
                     * @title Function Ignore Test
                     * @author User
                     * @notice This contract tests function-specific ignores
                     */
                    contract MyContract {
                      /// @notice Some explanation
                      function skipCheck(uint256 x) public {}
                    }
                  `

      const report = linter.processStr(code, {
        rules: {
          'use-natspec': [
            'error',
            {
              param: {
                enabled: true,
                ignore: {
                  function: ['skipCheck'],
                },
              },
            },
          ],
        },
      })

      assertNoErrors(report)
    })

    it('should ignore @return for specific function with named return', () => {
      const code = `
                    /**
                     * @title Function Ignore Test
                     * @author User
                     * @notice This contract tests function-specific ignores
                     */
                    contract MyContract {
                      /// @notice Something
                      /// @param x input
                      function getValue(uint x) public pure returns (uint256 result) {
                        return x;
                      }
                    }
                  `
      const report = linter.processStr(code, {
        rules: {
          'use-natspec': [
            'error',
            {
              return: {
                enabled: true,
                ignore: {
                  function: ['getValue'],
                },
              },
            },
          ],
        },
      })

      assertNoErrors(report)
    })

    it('should error on @author, ignore @title for specific contract and error on @return', () => {
      const code = `
                    contract HalfIgnored {

                      function doSomething(uint256 amount) external returns(uint256) {}
                    }
                  `

      const report = linter.processStr(code, {
        rules: {
          'use-natspec': [
            'error',
            {
              title: {
                enabled: true,
                ignore: {
                  contract: ['HalfIgnored'],
                },
              },
              notice: {
                enabled: false,
              },
              param: {
                enabled: false,
              },
            },
          ],
        },
      })

      assertErrorCount(report, 3)
      assert.ok(report.reports[0].message, "Missing @author tag in contract 'HalfIgnored'")
      assert.ok(report.reports[1].message, "Missing @return tag in function 'doSomething'")
      assert.ok(
        report.reports[2].message,
        "Mismatch in @return count for function 'doSomething'. Expected: 1, Found: 0"
      )
    })
  })
})
