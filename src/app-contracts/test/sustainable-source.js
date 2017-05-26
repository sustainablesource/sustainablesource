/* eslint-env mocha */
const expect = require('chai').expect
const SustainableSource = artifacts.require('SustainableSource.sol')

contract('SustainableSource', function () {
  it('is deployed', async function () {
    expect(await SustainableSource.deployed()).to.exist
  })
})
