const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const shell = require('shelljs')

function useFixture(dir) {
    const fixturePath = path.join(__dirname, dir).replace('/_common', '')

    const tmpDirContainer = os.tmpdir()
    this.testDirPath = path.join(tmpDirContainer, `solhint-tests-${dir}`)

    fs.ensureDirSync(this.testDirPath)
    fs.emptyDirSync(this.testDirPath)

    fs.copySync(fixturePath, this.testDirPath)

    shell.cd(this.testDirPath)
}

module.exports = { useFixture }
