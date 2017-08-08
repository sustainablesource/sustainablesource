/* eslint-env mocha */
const expect = require('chai').expect
const PullRequests = artifacts.require('PullRequests')
const TestablePullRequests = artifacts.require('TestablePullRequests')

contract('PullRequests', function () {
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
      const event = transaction.logs[0]
      expect(event.args.datasource).to.equal('URL')
      expect(event.args.arg).to.equal(query)
    })

    it('requests the merged state through oraclize', async function () {
      const query = createQuery('merged')
      const event = transaction.logs[1]
      expect(event.args.datasource).to.equal('URL')
      expect(event.args.arg).to.equal(query)
    })
  })
})
