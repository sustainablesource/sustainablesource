/* eslint-env mocha */
/* global web3 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const SustainableSource = artifacts.require('SustainableSource.sol')

chai.use(chaiAsPromised)

contract('SustainableSource', function (accounts) {
  const owner = accounts[0]
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

  describe('changing license fees', function () {
    const newFee = web3.toWei(5, 'finney')

    it('allows owner to change license fee', async function () {
      await sustainable.setLicenseFee(newFee, {from: owner})
      const actualFee = await sustainable.licenseFeeInWei()
      expect(actualFee.toString()).to.equal(newFee)
    })

    it('throws when others try to change license fee', async function () {
      const call = sustainable.setLicenseFee(newFee, {from: person})
      await expect(call).to.eventually.be.rejected
    })
  })
})
