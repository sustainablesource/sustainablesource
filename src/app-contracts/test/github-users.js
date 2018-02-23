/* eslint-env mocha */
/* global web3 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const Users = artifacts.require('Users.sol')
const TestableUsers = artifacts.require('TestableUsers.sol')

chai.use(chaiAsPromised)

contract('Users', function (accounts) {
  const oraclizePrice = 123456
  const oraclizeGasLimit = 400000

  let users

  beforeEach(async function () {
    users = await TestableUsers.new()
    await users.alwaysReturnOraclizePrice('URL', oraclizeGasLimit, oraclizePrice)
  })

  it('is deployed', async function () {
    expect(await Users.deployed()).to.exist
  })

  it('returns the attestation price', async function () {
    const price = await users.attestationPrice()
    expect(price.toNumber()).to.equal(oraclizePrice)
  })

  context('when attesting', function () {
    const username = 'some_user'
    const account = accounts[1]
    const gistId = '1234abcd'
    const oraclizeQueryId = 42
    const oraclizeProof = 'some oraclize proof'
    const oraclizeAddress = accounts[2]

    let transaction

    beforeEach(async function () {
      await users.returnOraclizeQueryIdsStartingFrom(oraclizeQueryId)
      await users.alwaysReturnOraclizeAddress(oraclizeAddress)
      transaction = await users.attest(
        username, gistId, { from: account, value: oraclizePrice }
      )
    })

    it('requests gist details through oraclize', async function () {
      const githubApi = 'https://api.github.com'
      const jsonPath = '$..[owner,files]..[login,filename,content]'
      const query = `json(${githubApi}/gists/${gistId}).${jsonPath}`
      const event = transaction.logs[1]
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
      const event = transaction.logs[1]
      expect(event.args.gaslimit.toNumber()).to.equal(oraclizeGasLimit)
    })

    it('only accepts calls with correct payment', async function () {
      const wrongPayment = oraclizePrice - 1
      const call = users.attest(username, gistId, { from: account, value: wrongPayment })
      await expect(call).to.eventually.be.rejected
    })

    it('only accepts callbacks from oraclize', async function () {
      const notOraclize = accounts[3]
      const call = users.__callback(0, '', '', { from: notOraclize })
      await expect(call).to.be.rejected
    })

    context('when oraclize query results are in', function () {
      async function callback (result) {
        await users.__callback(
          oraclizeQueryId, result, oraclizeProof, { from: oraclizeAddress }
        )
      }

      it('registers the username when gist is correct', async function () {
        await callback(`["${username}", "attestation", "${account}"]`)
        expect(await users.user(username)).to.equal(account)
        expect(await users.userByHash(web3.sha3(username))).to.equal(account)
      })

      it('does not register when username is incorrect', async function () {
        await callback(`["incorrect", "attestation", "${account}"]`)
        const user = await users.user(username)
        const userByHash = await users.userByHash(web3.sha3(username))
        expect(web3.toDecimal(user)).to.equal(0)
        expect(web3.toDecimal(userByHash)).to.equal(0)
      })

      it('does not register when filename is incorrect', async function () {
        await callback(`["${username}", "incorrect", "${account}"]`)
        const user = await users.user(username)
        const userByHash = await users.userByHash(web3.sha3(username))
        expect(web3.toDecimal(user)).to.equal(0)
        expect(web3.toDecimal(userByHash)).to.equal(0)
      })

      it('does not register when contents are incorrect', async function () {
        await callback(`["${username}", "attestation", "incorrect"]`)
        const user = await users.user(username)
        const userByHash = await users.userByHash(web3.sha3(username))
        expect(web3.toDecimal(user)).to.equal(0)
        expect(web3.toDecimal(userByHash)).to.equal(0)
      })

      it('only processes a query result once', async function () {
        await callback('some result')
        await expect(callback('some result')).to.be.rejected
      })
    })
  })
})
