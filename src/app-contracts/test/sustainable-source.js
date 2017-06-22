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
  const version = '34947cd157c8ddf98a61628a1a1d6ce163097f54'

  let sustainable

  beforeEach(async function () {
    sustainable = await SustainableSource.new(fee)
  })

  it('is deployed', async function () {
    expect(await SustainableSource.deployed()).to.exist
  })

  it('does not give out a license initially', async function () {
    expect(await sustainable.hasLicense(person, version)).to.be.false
  })

  context('when the correct license fee has been paid', async function () {
    beforeEach(async function () {
      await sustainable.payLicenseFee(person, version, {value: fee})
    })

    it('gives out a license', async function () {
      expect(await sustainable.hasLicense(person, version)).to.be.true
    })

    it('does not give out a license for other versions', async function () {
      const wrongVersion = '87b6b35a6889a0361d5db193a12fe8055b6da916'
      expect(await sustainable.hasLicense(person, wrongVersion)).to.be.false
    })
  })

  it('throws when less than license fee was paid', async function () {
    const tooLittle = web3.toWei(9, 'finney')
    const call = sustainable.payLicenseFee(person, version, {value: tooLittle})
    await expect(call).to.eventually.be.rejected
  })

  it('throws when more than license fee was paid', async function () {
    const tooMuch = web3.toWei(11, 'finney')
    const call = sustainable.payLicenseFee(person, version, {value: tooMuch})
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
