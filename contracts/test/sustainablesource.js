const { expect } = require('@sustainablesource/chai')
const SustainableSource = artifacts.require('SustainableSource')
const UsersFake = artifacts.require('UsersFake')
const PullRequestsInterface = artifacts.require('PullRequestsInterface')
const Licenses = artifacts.require('Licenses')
const { toBN, toWei } = web3.utils

contract('SustainableSource', function (accounts) {
  const repo = 'some/repo'
  const fee = toWei('400', 'finney')

  let sustainablesource
  let users

  beforeEach(async function () {
    users = await UsersFake.new()
    sustainablesource = await SustainableSource.new(users.address, repo, fee)
  })

  it('is deployed', async function () {
    expect(await SustainableSource.deployed()).to.exist()
  })

  it('uses the specified user registry', async function () {
    expect(await sustainablesource.users()).to.equal(users.address)
  })

  it('creates the correct pull request registry', async function () {
    const address = await sustainablesource.pullrequests()
    const pullrequests = await PullRequestsInterface.at(address)
    expect(await pullrequests.repository()).to.equal(repo)
  })

  it('creates a contributions registry', async function () {
    const address = await sustainablesource.contributions()
    expect(toBN(address).isZero()).to.be.false()
  })

  it('creates the payout contracts', async function () {
    const address = await sustainablesource.payout()
    expect(toBN(address).isZero()).to.be.false()
  })

  it('creates the correct licenses contract', async function () {
    const address = await sustainablesource.licenses()
    const licenses = await Licenses.at(address)
    const licenseFee = await licenses.licenseFeeInWei()
    expect(toBN(licenseFee).eq(toBN(fee))).to.be.true()
  })
})
