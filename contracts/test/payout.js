const { expect } = require('@sustainablesource/chai')
const { getBalance } = web3.eth
const ContributionsFake = artifacts.require('ContributionsFake')
const Payout = artifacts.require('Payout')
const toBN = web3.utils.toBN

contract('Payout', function (accounts) {
  const funds = parseInt(web3.utils.toWei('100', 'finney'))
  const contributor1 = accounts[1]
  const contributor2 = accounts[2]

  let payout
  let contributions

  beforeEach(async function () {
    contributions = await ContributionsFake.new()
    payout = await Payout.new(contributions.address)
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

      const initialBalance1 = toBN(await getBalance(contributor1))
      await payout.withdrawPayments(contributor1)
      const finalBalance1 = await getBalance(contributor1)
      const balanceIncrease1 = toBN(finalBalance1).sub(initialBalance1)

      const initialBalance2 = toBN(await getBalance(contributor2))
      await payout.withdrawPayments(contributor2)
      const finalBalance2 = await getBalance(contributor2)
      const balanceIncrease2 = toBN(finalBalance2).sub(initialBalance2)

      expect(
        balanceIncrease1.eq(toBN(0.25 * funds))
      ).to.be.true()
      expect(
        balanceIncrease2.eq(toBN(0.75 * funds))
      ).to.be.true()
    })
  })
})
