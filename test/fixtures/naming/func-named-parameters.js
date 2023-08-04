const FUNCTION_CALLS_ERRORS = {
  maxUnnamed_0_1u: {
    code: 'funcName(_sender);',
    maxUnnamed: 0,
  },

  maxUnnamed_1_3u: {
    code: 'funcName(_sender, amount, receiver);',
    maxUnnamed: 1,
  },

  maxUnnamed_2_3u: {
    code: 'funcName(_sender, amount, receiver);',
    maxUnnamed: 2,
  },

  maxUnnamed_3_4u: {
    code: 'funcName(_sender, amount, receiver, token);',
    maxUnnamed: 3,
  },
}

const FUNCTION_CALLS_OK = {
  maxUnnamed_0_0u: {
    code: 'funcName();',
    maxUnnamed: 0,
  },

  maxUnnamed_0_0uB: {
    code: 'funcName();',
    maxUnnamed: 10,
  },

  maxUnnamed_1_0u: {
    code: 'funcName({ sender: _sender, amount: _amount, receiver: _receiver });',
    maxUnnamed: 1,
  },

  maxUnnamed_1_1u: {
    code: 'funcName(sender);',
    maxUnnamed: 1,
  },
  maxUnnamed_2_2u: {
    code: 'funcName(sender, amount);',
    maxUnnamed: 2,
  },

  maxUnnamed3_0u: {
    code: 'funcName({ sender: _sender, amount: _amount, receiver: _receiver });',
    maxUnnamed: 3,
  },
}

module.exports = { FUNCTION_CALLS_ERRORS, FUNCTION_CALLS_OK }
