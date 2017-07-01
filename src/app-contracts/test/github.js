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
      const call = github.__callback(0, '', '', { from: notOraclize })
      await expect(call).to.be.rejected
    })

    context('when oraclize query results are in', function () {
      async function callback (result) {
        await github.__callback(
          oraclizeQueryId, result, oraclizeProof, { from: oraclizeAddress }
        )
      }

      it('registers the username when gist is correct', async function () {
        await callback(`["${username}", "attestation", "${account}"]`)
        expect(await github.users(username)).to.equal(account)
      })

      it('does not register when username is incorrect', async function () {
        await callback(`["incorrect", "attestation", "${account}"]`)
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })

      it('does not register when filename is incorrect', async function () {
        await callback(`["${username}", "incorrect", "${account}"]`)
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })

      it('does not register when contents are incorrect', async function () {
        await callback(`["${username}", "attestation", "incorrect"]`)
        const user = await github.users(username)
        expect(web3.toDecimal(user)).to.equal(0)
      })

      it('only processes a query result once', async function () {
        await callback('some result')
        await expect(callback('some result')).to.be.rejected
      })
    })
  })
})
