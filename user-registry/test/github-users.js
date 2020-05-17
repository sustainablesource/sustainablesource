const { expect } = require('@sustainablesource/chai')
const Users = artifacts.require('Users.sol')
const hexToNumber = web3.utils.hexToNumber
const keccak256 = web3.utils.keccak256

contract('Users', function (accounts) {
  const attestationPrice = 123456
  const oracleAddress = accounts[2]

  let users

  beforeEach(async function () {
    users = await Users.new(attestationPrice, oracleAddress)
  })

  it('is deployed', async function () {
    expect(await Users.deployed()).to.exist()
  })

  it('returns the attestation price', async function () {
    const price = await users.attestationPrice.call()
    expect(price.toNumber()).to.equal(attestationPrice)
  })

  context('when attesting', function () {
    const username = 'Some User'
    const account = accounts[1]
    const gistId = '1234abcd'

    let transaction

    const attest = async () =>
      users.attest(gistId, { from: account, value: attestationPrice })
    const extractRequestId = transaction => transaction.logs[0].args.requestId

    beforeEach(async function () {
      transaction = await attest()
    })

    it('stores request for oracle to pick up', async function () {
      const requestId = extractRequestId(transaction)
      const request = await users.oracleRequest(requestId)
      expect(request[0]).to.equal(gistId)
      expect(request[1]).to.equal(account)
    })

    it('hands out unique request ids', async () => {
      const requestId1 = extractRequestId(await attest())
      const requestId2 = extractRequestId(await attest())
      expect(requestId1).not.to.equal(requestId2)
    })

    it('only accepts calls with correct payment', async function () {
      const wrongPayment = attestationPrice - 1
      const call =
        users.attest(gistId, { from: account, value: wrongPayment })
      await expect(call).to.eventually.be.rejected()
    })

    it('only accepts responses from the oracle', async function () {
      const notTheOracle = accounts[3]
      const requestId = extractRequestId(transaction)
      const call =
        users.oracleResponse(requestId, false, '', { from: notTheOracle })
      await expect(call).to.be.rejected()
    })

    context('when oracle response is received', function () {
      const oracleResponse = async (attestationIsCorrect, username) => {
        const requestId = extractRequestId(transaction)
        await users.oracleResponse(requestId, attestationIsCorrect, username, {
          from: oracleAddress
        })
      }

      it('registers username when attestation is correct', async function () {
        await oracleResponse(true, username)
        expect(await users.user(username)).to.equal(account)
        expect(await users.userByHash(keccak256(username))).to.equal(account)
      })

      it('does not register when attestation is incorrect', async function () {
        await oracleResponse(false, username)
        const user = await users.user(username)
        const userByHash = await users.userByHash(keccak256(username))
        expect(hexToNumber(user)).to.equal(0)
        expect(hexToNumber(userByHash)).to.equal(0)
      })

      it('only processes a response to a request once', async function () {
        await oracleResponse(true, username)
        await expect(oracleResponse(true, username)).to.be.rejected()
      })
    })
  })
})
