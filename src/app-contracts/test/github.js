/* eslint-env mocha */
/* global web3 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const GitHub = artifacts.require('GitHub.sol')
const TestableGitHub = artifacts.require('TestableGitHub.sol')

chai.use(chaiAsPromised)

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
    const oraclizeAddress = accounts[2]

    let github

    beforeEach(async function () {
      github = await TestableGitHub.new()
      await github.alwaysReturnOraclizeQueryId(oraclizeQueryId)
      await github.alwaysReturnOraclizeAddress(oraclizeAddress)
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

    it('only accepts callbacks from oraclize', async function () {
      const notOraclize = accounts[3]
      expect(github.__callback(0, '', '', { from: notOraclize })).to.be.rejected
    })

    context('when oraclize returns correct gist details', function () {
      beforeEach(async function () {
        const result = `["${username}", "attestation", "${account}"]`
        github.__callback(oraclizeQueryId, result, oraclizeProof, { from: oraclizeAddress })
      })

      it('maps the github username to the ethereum account', async function () {
        expect(await github.users(username)).to.equal(account)
      })
    })

    context('wen oraclize returns incorrect username', function () {
      beforeEach(async function () {
        const result = `["incorrect", "attestation", "${account}"]`
        github.__callback(oraclizeQueryId, result, oraclizeProof, { from: oraclizeAddress })
      })

      it('does not register the github username', async function () {
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })
    })

    context('wen oraclize returns incorrect filename', function () {
      beforeEach(async function () {
        const result = `["${username}", "incorrect", "${account}"]`
        github.__callback(oraclizeQueryId, result, oraclizeProof, { from: oraclizeAddress })
      })

      it('does not register the github username', async function () {
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })
    })

    context('wen oraclize returns incorrect file contents', function () {
      beforeEach(async function () {
        const result = `["${username}", "attestation", "incorrect"]`
        github.__callback(oraclizeQueryId, result, oraclizeProof, { from: oraclizeAddress })
      })

      it('does not register the github username', async function () {
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })
    })
  })
})
