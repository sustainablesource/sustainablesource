const { expect } = require('@sustainablesource/chai')
const { getBalance } = web3.eth
const PayoutFake = artifacts.require('PayoutFake.sol')
const Licenses = artifacts.require('Licenses.sol')

contract('Licenses', function (accounts) {
  const owner = accounts[0]
  const person = accounts[1]
  const fee = web3.utils.toWei('10', 'finney')
  const version = '34947cd157c8ddf98a61628a1a1d6ce163097f54'

  let licenses
  let payout

  beforeEach(async function () {
    payout = await PayoutFake.new()
    licenses = await Licenses.new(payout.address, fee)
  })

  it('does not give out a license initially', async function () {
    expect(await licenses.hasLicense(person, version)).to.be.false()
  })

  context('when the correct license fee has been paid', async function () {
    beforeEach(async function () {
      await licenses.payLicenseFee(person, version, { value: fee })
    })

    it('gives out a license', async function () {
      expect(await licenses.hasLicense(person, version)).to.be.true()
    })

    it('does not give out a license for other versions', async function () {
      const wrongVersion = '87b6b35a6889a0361d5db193a12fe8055b6da916'
      expect(await licenses.hasLicense(person, wrongVersion)).to.be.false()
    })

    it('sends license fee to the payout contract', async function () {
      const balance = await getBalance(payout.address)
      expect(balance).to.equal(fee)
    })
  })

  it('throws when less than license fee was paid', async function () {
    const tooLittle = web3.utils.toWei('9', 'finney')
    const call = licenses.payLicenseFee(person, version, { value: tooLittle })
    await expect(call).to.eventually.be.rejected()
  })

  it('throws when more than license fee was paid', async function () {
    const tooMuch = web3.utils.toWei('11', 'finney')
    const call = licenses.payLicenseFee(person, version, { value: tooMuch })
    await expect(call).to.eventually.be.rejected()
  })

  describe('changing license fees', function () {
    const newFee = web3.utils.toWei('5', 'finney')

    it('allows owner to change license fee', async function () {
      await licenses.setLicenseFee(newFee, { from: owner })
      const actualFee = await licenses.licenseFeeInWei()
      expect(actualFee.toString()).to.equal(newFee)
    })

    it('throws when others try to change license fee', async function () {
      const call = licenses.setLicenseFee(newFee, { from: person })
      await expect(call).to.eventually.be.rejected()
    })
  })
})
