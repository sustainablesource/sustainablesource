/* eslint-env mocha */
/* global web3 */
const expect = require('chai').expect
const PullRequests = artifacts.require('PullRequests')
const TestablePullRequests = artifacts.require('TestablePullRequests')

contract('PullRequests', function (accounts) {
  const repo = 'sustainablesource/sustainablesource'
  const oraclizeAddress = accounts[2]
  const oraclizePrice = 123456
  const oraclizeGasLimit = 300000
  const registrationPrice = 2 * oraclizePrice
  const oraclizeProof = 'some oraclize proof'

  let pullRequests

  beforeEach(async function () {
    pullRequests = await TestablePullRequests.new(repo)
    await pullRequests.alwaysReturnOraclizeAddress(oraclizeAddress)
    await pullRequests
      .alwaysReturnOraclizePrice('URL', oraclizeGasLimit, oraclizePrice)
  })

  it('is deployed', async function () {
    expect(await PullRequests.deployed()).to.exist
  })

  it('returns the registration price', async function () {
    const price = await pullRequests.registrationPrice()
    expect(price.toNumber()).to.equal(registrationPrice)
  })

  context('when registering a pull request', function () {
    const creator = 'some_user'
    const pullRequestId = 1234
    const usernameQueryId = 42

    let transaction

    beforeEach(async function () {
      await pullRequests.alwaysReturnOraclizeQueryId(usernameQueryId)
      transaction = await pullRequests.register(
        pullRequestId, creator, { value: registrationPrice }
      )
    })

    function createQuery (jsonPath) {
      const githubApi = 'https://api.github.com'
      const url = `${githubApi}/${repo}/pulls/${pullRequestId}`
      return `json(${url}).${jsonPath}`
    }

    it('requests the user name through oraclize', async function () {
      const query = createQuery('user.login')
      const event = transaction.logs[1]
      expect(event.args.datasource).to.equal('URL')
      expect(event.args.arg).to.equal(query)
    })

    it('requests the merged state through oraclize', async function () {
      const query = createQuery('merged')
      const event = transaction.logs[2]
      expect(event.args.datasource).to.equal('URL')
      expect(event.args.arg).to.equal(query)
    })

    it('requests oraclize proofs', async function () {
      const notary = 0x10
      const ipfs = 0x01
      const event = transaction.logs[0]
      expect(web3.toDecimal(event.args.proofType)).to.equal(notary | ipfs)
    })

    it('specifies a custom gas limit', async function () {
      const event1 = transaction.logs[1]
      const event2 = transaction.logs[2]
      expect(event1.args.gaslimit.toNumber()).to.equal(oraclizeGasLimit)
      expect(event2.args.gaslimit.toNumber()).to.equal(oraclizeGasLimit)
    })

    it('only accepts calls with correct payment', async function () {
      const wrongPayment = registrationPrice - 1
      const call = pullRequests.register(pullRequestId, { value: wrongPayment })
      await expect(call).to.eventually.be.rejected
    })

    it('only accepts callbacks from oraclize', async function () {
      const notOraclize = accounts[3]
      const call = pullRequests.__callback(0, '', '', { from: notOraclize })
      await expect(call).to.be.rejected
    })

    context('when oraclize returns the user name', function () {
      async function usernameCallback (result) {
        await pullRequests.__callback(
          usernameQueryId, result, oraclizeProof, { from: oraclizeAddress }
        )
      }

      it('registers the creator when username is correct', async function () {
        await usernameCallback(`["${creator}"]`)
        expect(await pullRequests.creators(pullRequestId)).to.equal(creator)
      })

      it('does not register when username is incorrect', async function () {
        await usernameCallback('["incorrect_user"]')
        expect(await pullRequests.creators(pullRequestId)).to.equal('')
      })
    })
  })
})
