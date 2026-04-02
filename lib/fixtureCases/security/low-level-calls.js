const WARN_LOW_LEVEL_CODES = [
  'anyAddress.call(code);',
  'a.callcode(test1);',
  'a.delegatecall(test1);',
  'anyAddress.call.value(code)();',
]
const ALLOWED_LOW_LEVEL_CODES = ['anyAddress.call{value: 1 ether}("");']

const WARN_UNCHECKED_CALLS = [
  'addr.call(data);',
  'addr.staticcall(data);',
  'addr.delegatecall(data);',
  'addr.call{value: 1 ether}("");',
  'addr.call.value(1)();',
]
const ALLOWED_UNCHECKED_CALLS = [
  '(bool success, ) = addr.call(data);',
  '(bool success, bytes memory result) = addr.call(data);',
  'if(addr.call(data)) {}',
  'require(addr.call(data));',
  'assert(addr.call(data));',
]

module.exports = {
  lowLevelCalls: [WARN_LOW_LEVEL_CODES, ALLOWED_LOW_LEVEL_CODES],
  uncheckedCalls: [WARN_UNCHECKED_CALLS, ALLOWED_UNCHECKED_CALLS],
}
