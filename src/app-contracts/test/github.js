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
    const username = 'some_user'
    const account = accounts[1]
    const gistId = '1234abcd'
    const oraclizeQueryId = 42
    const oraclizeProof = 'some oraclize proof'

    let github

    beforeEach(async function () {
      github = await TestableGitHub.new()
      await github.alwaysReturnOraclizeQueryId(oraclizeQueryId)
      await github.attest(username, gistId, { from: account })
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

    context('when oraclize returns correct gist details', function () {
      beforeEach(async function () {
        const result = `["${username}", "attestation", "${account}"]`
        github.__callback(oraclizeQueryId, result, oraclizeProof)
      })

      it('maps the github username to the ethereum account', async function () {
        expect(await github.users(username)).to.equal(account)
      })
    })

    context('wen oraclize returns incorrect username', function () {
      beforeEach(async function () {
        const result = `["incorrect", "attestation", "${account}"]`
        github.__callback(oraclizeQueryId, result, oraclizeProof)
      })

      it('does not register the github username', async function () {
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })
    })

    context('wen oraclize returns incorrect filename', function () {
      beforeEach(async function () {
        const result = `["${username}", "incorrect", "${account}"]`
        github.__callback(oraclizeQueryId, result, oraclizeProof)
      })

      it('does not register the github username', async function () {
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })
    })

    context('wen oraclize returns incorrect file contents', function () {
      beforeEach(async function () {
        const result = `["${username}", "attestation", "incorrect"]`
        github.__callback(oraclizeQueryId, result, oraclizeProof)
      })

      it('does not register the github username', async function () {
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })
    })
  })
})
