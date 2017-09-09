/* eslint-env mocha */
/* global web3 */
const expect = require('chai').expect
const isTestNetwork = require('./test-networks').isTestNetwork
const Users = artifacts.require('Users.sol')
const PullRequests = artifacts.require('PullRequests.sol')

contract('GitHub', function (accounts) {
  const address = '0x7792eba89dd0facd048329955c5855d52554b788'
  const username = 'markspanbroek'

  describe('integration testing environment', function () {
    it('has the correct main account', async function () {
      if (await isTestNetwork(web3)) {
        expect(accounts[0]).to.equal(address)
      }
    })
  })

  describe('integration tests (up to 5 minutes each)', function () {
    beforeEach(function () {
      this.timeout(5 * 60 * 1000)
    })

    describe('user attestation', function () {
      const gistId = 'a85344feaf0141e1b393f399d8c01318'

      let users
      let price

      beforeEach(async function () {
        users = await Users.deployed()
        price = await users.attestationPrice()
      })

      it('has sufficient funds', async function () {
        if (await isTestNetwork(web3)) {
          const balance = await web3.eth.getBalance(address)
          expect(balance.toNumber()).to.be.above(price.toNumber())
        }
      })

      it('attests with a correct gist', async function () {
        async function poll () {
          if (await users.users(username) !== address) {
            await wait(5000)
            await poll()
          }
        }
        if (await isTestNetwork(web3)) {
          await users.attest(username, gistId, { value: price })
          await poll()
        }
      })
    })

    describe('pull request registration', function () {
      const pullRequestId = 3

      let pullRequests
      let price

      beforeEach(async function () {
        pullRequests = await PullRequests.deployed()
        price = await pullRequests.registrationPrice()
      })

      it('has sufficient funds', async function () {
        if (await isTestNetwork(web3)) {
          const balance = await web3.eth.getBalance(address)
          expect(balance.toNumber()).to.be.above(price.toNumber())
        }
      })

      it('registers a pull request', async function () {
        async function poll () {
          const creator = await pullRequests.creators(pullRequestId)
          const isMerged = await pullRequests.isMerged(pullRequestId)
          if (creator !== username || !isMerged) {
            await wait(500)
            await poll()
          }
        }
        if (await isTestNetwork(web3)) {
          await pullRequests.register(pullRequestId, username, { value: price })
          await poll()
        }
      })
    })
  })

  async function wait (milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(resolve, milliseconds)
    })
  }
})
