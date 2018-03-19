const Payout = artifacts.require('Payout')

contract('Payout', function (accounts) {
  it('is deployed', async function () {
    expect(await Payout.deployed()).to.exist()
  })
})

