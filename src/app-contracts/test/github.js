/* eslint-env mocha */
/* global web3 */
const expect = require('chai').expect
const GitHub = artifacts.require('GitHub.sol')
const TestableGitHub = artifacts.require('TestableGitHub.sol')

contract('GitHub', function (accounts) {
  it('is deployed', async function () {
    expect(await GitHub.deployed()).to.exist
  })

  context('when attesting', function () {
    const account = accounts[1]
    const gistId = '1234abcd'

    let github

    beforeEach(async function () {
      github = await TestableGitHub.new()
      await github.attest(gistId, { from: account })
    })

    it('requests gist details through oraclize', async function () {
      const githubApi = 'https://api.github.com'
      const jsonPath = '$..[owner,files]..[login,filename,content]'
      const query = `json(${githubApi}/gists/${gistId}).${jsonPath}`
      expect(await github.latestOraclizeDataSource()).to.equal('URL')
      expect(await github.latestOraclizeArg()).to.equal(query)
    })

    it('requests oraclize proofs', async function () {
      const notary = 0x10
      const ipfs = 0x01
      const proofType = await github.latestProofType()
      expect(web3.toDecimal(proofType)).to.equal(notary | ipfs)
    })
  })
})
