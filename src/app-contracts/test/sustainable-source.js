/* eslint-env mocha */
/* global web3 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const SustainableSource = artifacts.require('SustainableSource.sol')

chai.use(chaiAsPromised)

contract('SustainableSource', function (accounts) {
  const person = accounts[1]
  const fee = web3.toWei(10, 'finney')

  let sustainable

  beforeEach(async function () {
    sustainable = await SustainableSource.new(fee)
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

  it('throws when less than license fee was paid', async function () {
    const tooLittle = web3.toWei(9, 'finney')
    const call = sustainable.payLicenseFeeFor(person, {value: tooLittle})
    await expect(call).to.eventually.be.rejected
  })

  it('throws when more than license fee was paid', async function () {
    const tooMuch = web3.toWei(11, 'finney')
    const call = sustainable.payLicenseFeeFor(person, {value: tooMuch})
    await expect(call).to.eventually.be.rejected
  })
})
