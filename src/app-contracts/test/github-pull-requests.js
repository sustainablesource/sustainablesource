/* eslint-env mocha */
/* global web3 */
const expect = require('chai').expect
const PullRequests = artifacts.require('PullRequests')
const TestablePullRequests = artifacts.require('TestablePullRequests')

contract('PullRequests', function () {
  const oraclizeGasLimit = 300000

  it('is deployed', async function () {
    expect(await PullRequests.deployed()).to.exist
  })

  context('when registering a pull request', function () {
    const repo = 'sustainablesource/sustainablesource'
    const pullRequestId = 1234

    let pullRequests
    let transaction

    beforeEach(async function () {
      pullRequests = await TestablePullRequests.new(repo)
      transaction = await pullRequests.register(pullRequestId)
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
  })
})
