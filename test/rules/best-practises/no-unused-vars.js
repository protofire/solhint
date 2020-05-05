const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { contractWith, funcWith, multiLine } = require('./../../common/contract-builder')

describe('Linter - no-unused-vars', () => {
  const UNUSED_VARS = [
    contractWith('function a(uint a, uint b) public { b += 1; }'),
    funcWith('uint a = 0;'),
    funcWith('var (a) = 1;'),
    contractWith('function a(uint a, uint b) public { uint c = a + b; }'),
    contractWith('function foo(uint a) public {}')
  ]

  UNUSED_VARS.forEach((curData, i) =>
    it(`should raise warn for unused vars (${i})`, () => {
      const report = linter.processStr(curData, {
        rules: { 'no-unused-vars': 'warn' }
      })

      assertWarnsCount(report, 1)
      assertErrorMessage(report, 'unused')
    })
  )

  const USED_VARS = [
    contractWith('function a(uint a) public { uint b = bytes32(a); b += 1; }'),
    contractWith('function a() public returns (uint c) { return 1; }'),
    contractWith('function a(uint a, uint c) public returns (uint c);'),
    contractWith('function a(uint amount) public { foo.deposit{value: amount}(); }'),
    contractWith('function a(uint amount) public { foo.deposit({value: amount}); }'),
    contractWith(
      multiLine(
        'function a(address a) internal {',
        '  assembly {',
        '    let t := eq(a, and(mask, calldataload(4)))',
        '  }',
        '}'
      )
    ),
    contractWith(
      multiLine(
        'function a() public view returns (uint, uint) {',
        '  return (1, 2);                               ',
        '}                                              ',
        '                                               ',
        'function b() public view returns (uint, uint) {',
        '  (uint c, uint d) = a();                      ',
        '  return (c, d);                               ',
        '}                                              '
      )
    ),
    contractWith(
      multiLine(
        'function a() public view returns (uint, uint) {    ',
        '  return (1, 2);                                   ',
        '}                                                  ',
        '                                                   ',
        'function b() public view returns (uint c, uint d) {',
        '  (c, d) = a();                                    ',
        '  return (c, d);                                   ',
        '}                                                  '
      )
    )
  ]

  USED_VARS.forEach((curData, i) =>
    it(`should not raise warn for vars (${i})`, () => {
      const report = linter.processStr(curData, {
        rules: { 'no-unused-vars': 'warn' }
      })

      assertNoWarnings(report)
    })
  )

  it('should not emit an error in override functions without parameter names', () => {
    const code = contractWith(`
function withdrawalAllowed(address) public view override returns (bool) {
    return _state == State.Refunding;
}
    `)

    const report = linter.processStr(code, {
      rules: { 'no-unused-vars': 'warn' }
    })

    assertNoWarnings(report)
  })
})
