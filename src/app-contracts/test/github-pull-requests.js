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

    it('requests the user name through oraclize', async function () {
      const githubApi = 'https://api.github.com'
      const url = `${githubApi}/${repo}/pulls/${pullRequestId}`
      const jsonPath = 'user.login'
      const query = `json(${url}).${jsonPath}`
      const event = transaction.logs[0]
      expect(event.args.datasource).to.equal('URL')
      expect(event.args.arg).to.equal(query)
    })
  })
})
