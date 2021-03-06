const { expect } = require('@sustainablesource/chai')
const Users = artifacts.require('Users.sol')
const TestableUsers = artifacts.require('TestableUsers.sol')
const hexToNumber = web3.utils.hexToNumber
const keccak256 = web3.utils.keccak256

contract('Users', function (accounts) {
  const provablePrice = 123456
  const provableGasLimit = 400000

  let users

  beforeEach(async function () {
    users = await TestableUsers.new()
    await users.alwaysReturnProvablePrice(
      'URL',
      provableGasLimit,
      provablePrice
    )
  })

  it('is deployed', async function () {
    expect(await Users.deployed()).to.exist()
  })

  it('returns the attestation price', async function () {
    const price = await users.attestationPrice.call()
    expect(price.toNumber()).to.equal(provablePrice)
  })

  context('when attesting', function () {
    const username = 'Some User'
    const account = accounts[1]
    const gistId = '1234abcd'
    const provableQueryId = '0x42'
    const provableAddress = accounts[2]

    let transaction

    beforeEach(async function () {
      await users.returnProvableQueryIdsStartingFrom(provableQueryId)
      await users.alwaysReturnProvableAddress(provableAddress)
      transaction = await users.attest(username, gistId, {
        from: account,
        value: provablePrice
      })
    })

    it('requests gist details through Provable', async function () {
      const githubApi = 'https://api.github.com'
      const jsonPath = '$..[owner,files]..[login,filename,content]'
      const query = `json(${githubApi}/gists/${gistId}).${jsonPath}`
      const event = transaction.logs[1]
      expect(event.args.datasource).to.equal('URL')
      expect(event.args.arg).to.equal(query)
    })

    it('requests Provable proofs', async function () {
      const notary = 0x10
      const ipfs = 0x01
      const event = transaction.logs[0]
      expect(hexToNumber(event.args.proofType)).to.equal(notary | ipfs)
    })

    it('specifies a custom gas limit', async function () {
      const event = transaction.logs[1]
      expect(event.args.gaslimit.toNumber()).to.equal(provableGasLimit)
    })

    it('only accepts calls with correct payment', async function () {
      const wrongPayment = provablePrice - 1
      const call = users.attest(username, gistId, {
        from: account,
        value: wrongPayment
      })
      await expect(call).to.eventually.be.rejected()
    })

    it('only accepts callbacks from Provable', async function () {
      const notProvable = accounts[3]
      const call = users.__callback(0, '', { from: notProvable })
      await expect(call).to.be.rejected()
    })

    context('when Provable query results are in', function () {
      async function provableCallback (result) {
        await users.__callback(provableQueryId, result, {
          from: provableAddress
        })
      }

      it('registers the username when gist is correct', async function () {
        await provableCallback(`["${username}", "attestation", "${account}"]`)
        expect(await users.user(username)).to.equal(account)
        expect(await users.userByHash(keccak256(username))).to.equal(account)
      })

      it('does not register when username is incorrect', async function () {
        await provableCallback(`["incorrect", "attestation", "${account}"]`)
        const user = await users.user(username)
        const userByHash = await users.userByHash(keccak256(username))
        expect(hexToNumber(user)).to.equal(0)
        expect(hexToNumber(userByHash)).to.equal(0)
      })

      it('does not register when filename is incorrect', async function () {
        await provableCallback(`["${username}", "incorrect", "${account}"]`)
        const user = await users.user(username)
        const userByHash = await users.userByHash(keccak256(username))
        expect(hexToNumber(user)).to.equal(0)
        expect(hexToNumber(userByHash)).to.equal(0)
      })

      it('does not register when contents are incorrect', async function () {
        await provableCallback(`["${username}", "attestation", "incorrect"]`)
        const user = await users.user(username)
        const userByHash = await users.userByHash(keccak256(username))
        expect(hexToNumber(user)).to.equal(0)
        expect(hexToNumber(userByHash)).to.equal(0)
      })

      it('only processes a query result once', async function () {
        await provableCallback('some result')
        await expect(provableCallback('some result')).to.be.rejected()
      })
    })
  })
})
