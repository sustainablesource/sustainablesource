/* eslint-env mocha */
const Payout = artifacts.require('Payout.sol')
const expect = require('chai').expect

contract('Payout', function () {
  it('is deployed', async function () {
    expect(await Payout.deployed()).to.exist
  })
})
