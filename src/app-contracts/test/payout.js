const expect = require('chai').expect
const getBalance = require('./get-balance')
const ContributionsFake = artifacts.require('ContributionsFake')
const Payout = artifacts.require('Payout')

contract('Payout', function (accounts) {
  const funds = parseInt(web3.toWei(100, 'finney'))
  const contributor1 = accounts[1]
  const contributor2 = accounts[2]

  let payout
  let contributions

  beforeEach(async function () {
    contributions = await ContributionsFake.new()
    payout = await Payout.new(contributions.address)
  })

  it('is deployed', async function () {
    expect(await Payout.deployed()).to.exist()
  })

  it('rejects payments when there are no contributors', async function () {
    await expect(payout.pay({ value: funds })).to.be.rejected()
  })

  it('rejects payments when there are no contributions', async function () {
    await contributions.addContributor(contributor1)
    await expect(payout.pay({ value: funds })).to.be.rejected()
  })

  context('when there are multiple contributors', function () {
    beforeEach(async function () {
      await contributions.addContributor(contributor1)
      await contributions.addContributor(contributor2)
      await contributions.addContributions(contributor1, 10)
      await contributions.addContributions(contributor2, 30)
    })

    it('divides funds according to amount of contributions', async function () {
      await payout.pay({ value: funds })

      const initialBalance1 = await getBalance(web3, contributor1)
      const transaction1 = await payout.withdrawPayments({ from: contributor1 })
      const finalBalance1 = await getBalance(web3, contributor1)
      const balanceIncrease1 = finalBalance1.sub(initialBalance1).toNumber()

      const initialBalance2 = await getBalance(web3, contributor2)
      const transaction2 = await payout.withdrawPayments({ from: contributor2 })
      const finalBalance2 = await getBalance(web3, contributor2)
      const balanceIncrease2 = finalBalance2.sub(initialBalance2).toNumber()

      expect(balanceIncrease1).to.equal(0.25 * funds - cost(transaction1))
      expect(balanceIncrease2).to.equal(0.75 * funds - cost(transaction2))
    })
  })
})

function cost (transaction) {
  return Payout.defaults().gasPrice * transaction.receipt.gasUsed
}

