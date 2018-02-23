/* eslint-env mocha */
const Payout = artifacts.require('Payout.sol')
const Users = artifacts.require('UsersFake.sol')
const PullRequests = artifacts.require('PullRequestsFake.sol')
const expect = require('chai').expect

contract('Payout', function (accounts) {
  let payout
  let users
  let pullRequests

  beforeEach(async function () {
    pullRequests = await PullRequests.new()
    users = await Users.new()
    payout = await Payout.new(users.address, pullRequests.address)
  })

  it('is deployed', async function () {
    expect(await Payout.deployed()).to.exist
  })

  it('has 0 shares by default', async function () {
    const totalNumberOfShares = await payout.totalNumberOfShares()
    const numberOfShareholders = await payout.numberOfShareholders()
    expect(totalNumberOfShares.toNumber()).to.equal(0)
    expect(numberOfShareholders.toNumber()).to.equal(0)
  })

  context('when registering a merged pull request', function () {
    const pullRequestId = 42
    const creator = 'a creator'
    const creatorAddress = accounts[1]

    beforeEach(async function () {
      await pullRequests.setCreator(pullRequestId, creator)
      await pullRequests.setIsMerged(pullRequestId, true)
      await users.setUser(creator, creatorAddress)
      await payout.registerShare(pullRequestId)
    })

    it('increments the number of shares', async function () {
      const totalNumberOfShares = await payout.totalNumberOfShares()
      expect(totalNumberOfShares.toNumber()).to.equal(1)
    })

    it('registers the share holder', async function () {
      const numberOfShareholders = await payout.numberOfShareholders()
      const shareHolder = await payout.getShareHolder(0)
      expect(numberOfShareholders.toNumber()).to.equal(1)
      expect(shareHolder).to.equal(creatorAddress)
    })

    it('registers the share', async function () {
      const numberOfShares = await payout.numberOfShares(creatorAddress)
      expect(numberOfShares.toNumber()).to.equal(1)
    })

    context('when registering another pull request', function () {
      beforeEach(async function () {
        await pullRequests.setCreator(43, creator)
        await pullRequests.setIsMerged(43, true)
        await payout.registerShare(43)
      })

      it('increases the number of shares', async function () {
        const numberOfShares = await payout.numberOfShares(creatorAddress)
        expect(numberOfShares.toNumber()).to.equal(2)
      })

      it('does not re-register the shareholder', async function () {
        const numberOfShareholders = await payout.numberOfShareholders()
        expect(numberOfShareholders.toNumber()).to.equal(1)
      })
    })
  })
})
