const { expect } = require('@sustainablesource/chai')
const Users = artifacts.require('Users.sol')
const SustainableSource = artifacts.require('SustainableSource.sol')
const PullRequests = artifacts.require('PullRequests.sol')
const { toBN } = web3.utils
const { getBalance } = web3.eth

contract('GitHub', function (accounts) {
  const address = '0xc995206c20d29A428cc8535279525086b6e15C48'
  const username = 'markspanbroek'

  describe('integration testing environment', function () {
    it('has the correct main account', async function () {
      expect(accounts[0]).to.equal(address)
    })
  })

  describe('integration tests (up to 5 minutes each)', function () {
    beforeEach(function () {
      this.timeout(5 * 60 * 1000)
    })

    describe('user attestation', function () {
      const gistId = '321aae303592471c1ed314a9a499cf65'

      let users
      let price

      beforeEach(async function () {
        users = await Users.deployed()
        price = await users.attestationPrice.call()
      })

      it('has sufficient funds', async function () {
        const balance = toBN(await getBalance(address))
        expect(balance.gt(price)).to.be.true()
      })

      it('attests with a correct gist', async function () {
        async function poll () {
          if ((await users.user(username)) !== address) {
            await wait(5000)
            await poll()
          }
        }
        await users.attest(username, gistId, { value: price })
        await poll()
      })
    })

    describe('pull request registration', function () {
      const pullRequestId = 3

      let pullRequests
      let price

      beforeEach(async function () {
        const sustainablesource = await SustainableSource.deployed()
        const address = await sustainablesource.pullrequests()
        pullRequests = await PullRequests.at(address)
        price = await pullRequests.registrationPrice.call()
      })

      it('has sufficient funds', async function () {
        const balance = toBN(await getBalance(address))
        expect(balance.gt(price)).to.be.true()
      })

      it('registers a pull request', async function () {
        async function poll () {
          const creator = await pullRequests.creator(pullRequestId)
          const isMerged = await pullRequests.isMerged(pullRequestId)
          if (creator !== username || !isMerged) {
            await wait(500)
            await poll()
          }
        }
        await pullRequests.register(pullRequestId, username, { value: price })
        await poll()
      })
    })
  })

  async function wait (milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(resolve, milliseconds)
    })
  }
})
