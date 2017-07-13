/* eslint-env mocha */
/* global web3 */
const expect = require('chai').expect
const isTestNetwork = require('./test-networks').isTestNetwork
const Users = artifacts.require('Users.sol')

if (!isTestNetwork(web3)) {
  return
}

contract('GitHub', function (accounts) {
  const gistId = 'a85344feaf0141e1b393f399d8c01318'
  const address = '0x7792eba89dd0facd048329955c5855d52554b788'
  const username = 'markspanbroek'

  let users
  let price

  beforeEach(async function () {
    users = await Users.deployed()
    price = await users.attestationPrice()
  })

  describe('integration testing environment', function () {
    it('has the correct main account', function () {
      expect(accounts[0]).to.equal(address)
    })

    it('has sufficient funds', async function () {
      const balance = await web3.eth.getBalance(address)
      expect(balance.toNumber()).to.be.above(price.toNumber())
    })
  })

  describe('integration tests (up to 5 minutes each)', function () {
    beforeEach(function () {
      this.timeout(5 * 60 * 1000)
    })

    it('attests with a correct gist', function (done) {
      async function poll () {
        if (await users.users(username) === address) {
          done()
        } else {
          await poll()
        }
      }
      users.attest(username, gistId, { value: price }).then(poll)
    })
  })
})
