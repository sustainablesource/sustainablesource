/* eslint-env mocha */
const Contributions = artifacts.require('Contributions.sol')
const Users = artifacts.require('UsersFake.sol')
const PullRequests = artifacts.require('PullRequestsFake.sol')
const expect = require('chai').expect

contract('Contributions', function (accounts) {
  let contributions
  let users
  let pullRequests

  beforeEach(async function () {
    pullRequests = await PullRequests.new()
    users = await Users.new()
    contributions = await Contributions.new(users.address, pullRequests.address)
  })

  it('is deployed', async function () {
    expect(await Contributions.deployed()).to.exist
  })

  it('has 0 contributions by default', async function () {
    const totalContributions = await contributions.totalContributions()
    const numberOfContributors = await contributions.numberOfContributors()
    expect(totalContributions.toNumber()).to.equal(0)
    expect(numberOfContributors.toNumber()).to.equal(0)
  })

  context('when registering a merged pull request', function () {
    const pullRequestId = 42
    const creator = 'a creator'
    const creatorAddress = accounts[1]

    beforeEach(async function () {
      await pullRequests.setCreator(pullRequestId, creator)
      await pullRequests.setIsMerged(pullRequestId, true)
      await users.setUser(creator, creatorAddress)
      await contributions.registerContribution(pullRequestId)
    })

    it('increments the number of contributions', async function () {
      const totalContributions = await contributions.totalContributions()
      expect(totalContributions.toNumber()).to.equal(1)
    })

    it('registers the contributor', async function () {
      const numberOfContributors = await contributions.numberOfContributors()
      const contributor = await contributions.getContributor(0)
      expect(numberOfContributors.toNumber()).to.equal(1)
      expect(contributor).to.equal(creatorAddress)
    })

    it('registers the contribution', async function () {
      const amount = await contributions.numberOfContributions(creatorAddress)
      expect(amount.toNumber()).to.equal(1)
    })

    context('when registering another pull request', function () {
      beforeEach(async function () {
        await pullRequests.setCreator(43, creator)
        await pullRequests.setIsMerged(43, true)
        await contributions.registerContribution(43)
      })

      it('increases the number of contributions', async function () {
        const amount = await contributions.numberOfContributions(creatorAddress)
        expect(amount.toNumber()).to.equal(2)
      })

      it('does not re-register the contributor', async function () {
        const numberOfContributors = await contributions.numberOfContributors()
        expect(numberOfContributors.toNumber()).to.equal(1)
      })
    })
  })
})
