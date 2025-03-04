const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const shell = require('shelljs')

function useFixture(dir) {

  console.log('\n\ndiR :>> ', dir);
  
  beforeEach(`switch to ${dir}`, function () {
    const fixturePath = path.join(__dirname, dir).replace('/_common', '')
    
    console.log('\n\nfixturePath :>> ', fixturePath);
    
    const tmpDirContainer = os.tmpdir()
    
    console.log('tmpDirContainer :>> ', tmpDirContainer);
    
    this.testDirPath = path.join(tmpDirContainer, `solhint-tests-${dir}`)
    
    console.log('this.testDirPath :>> ', this.testDirPath);
    console.log('\n\n');

    fs.ensureDirSync(this.testDirPath)
    fs.emptyDirSync(this.testDirPath)

    fs.copySync(fixturePath, this.testDirPath)

    shell.cd(this.testDirPath)
  })
}

module.exports = { useFixture }
