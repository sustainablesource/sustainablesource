/* eslint-env mocha */
/* global web3 */
const expect = require('chai').expect
const SustainableSource = artifacts.require('SustainableSource.sol')

contract('SustainableSource', function (accounts) {
  const person = accounts[1]
  const fee = web3.toWei(1, 'ether')

  let sustainable

  beforeEach(async function () {
    sustainable = await SustainableSource.new()
  })

  it('is deployed', async function () {
    expect(await SustainableSource.deployed()).to.exist
  })

  it('does not give out a license initially', async function () {
    expect(await sustainable.hasLicense(person)).to.be.false
  })

  it('gives out a license when license fee was paid', async function () {
    await sustainable.payLicenseFeeFor(person, {value: fee})
    expect(await sustainable.hasLicense(person)).to.be.true
  })
})
