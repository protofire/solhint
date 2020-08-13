module.exports = [
  {
    description: 'State variable declaration after function',
    code: `
  contract MyContract {
    function foo() public {}

    uint a;
  }
`
  },
  {
    description: 'Library after contract',
    code: `
  contract MyContract {}

  library MyLibrary {}
`
  },
  {
    description: 'Interface after library',
    code: `
  library MyLibrary {}

  interface MyInterface {}
`
  }
]
