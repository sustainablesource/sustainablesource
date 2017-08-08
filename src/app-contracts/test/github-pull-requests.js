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

    beforeEach(async function () {
      pullRequests = await TestablePullRequests.new(repo)
      await pullRequests.register(pullRequestId)
    })

    it('requests the user name through oraclize', async function () {
      const githubApi = 'https://api.github.com'
      const url = `${githubApi}/${repo}/pulls/${pullRequestId}`
      const jsonPath = 'user.login'
      const query = `json(${url}).${jsonPath}`
      expect(await pullRequests.latestOraclizeDataSource()).to.equal('URL')
      expect(await pullRequests.latestOraclizeArg()).to.equal(query)
    })
  })
})
