/* eslint-env mocha */
const expect = require('chai').expect
const GitHub = artifacts.require('GitHub.sol')

contract('GitHub', function () {
  it('is deployed', async function () {
    expect(await GitHub.deployed()).to.exist
  })
})
