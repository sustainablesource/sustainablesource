const { expect } = require('@sustainablesource/chai')
const TestablePullRequests = artifacts.require('TestablePullRequests')
const hexToNumber = web3.utils.hexToNumber

contract('PullRequests', function (accounts) {
  const repo = 'sustainablesource/sustainablesource'
  const provableAddress = accounts[2]
  const provablePrice = 123456
  const provableGasLimit = 300000
  const registrationPrice = 2 * provablePrice

  let pullRequests

  beforeEach(async function () {
    pullRequests = await TestablePullRequests.new(repo)
    await pullRequests.alwaysReturnProvableAddress(provableAddress)
    await pullRequests.alwaysReturnProvablePrice(
      'URL',
      provableGasLimit,
      provablePrice
    )
  })

  it('returns the registration price', async function () {
    const price = await pullRequests.registrationPrice.call()
    expect(price.toNumber()).to.equal(registrationPrice)
  })

  context('when registering a pull request', function () {
    const creator = 'some_user'
    const pullRequestId = 1234
    const usernameQueryId = toBytes32(42)
    const mergedStateQueryId = toBytes32(43)

    let transaction

    beforeEach(async function () {
      await pullRequests.returnProvableQueryIdsStartingFrom(usernameQueryId)
      transaction = await pullRequests.register(pullRequestId, creator, {
        value: registrationPrice
      })
    })

    function createQuery (jsonPath) {
      const githubApi = 'https://api.github.com'
      const url = `${githubApi}/repos/${repo}/pulls/${pullRequestId}`
      return `json(${url}).${jsonPath}`
    }

    it('requests the user name through Provable', async function () {
      const query = createQuery('user.login')
      const event = transaction.logs[1]
      expect(event.args.datasource).to.equal('URL')
      expect(event.args.arg).to.equal(query)
    })

    it('requests the merged state through Provable', async function () {
      const query = createQuery('merged')
      const event = transaction.logs[2]
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
      const event1 = transaction.logs[1]
      const event2 = transaction.logs[2]
      expect(event1.args.gaslimit.toNumber()).to.equal(provableGasLimit)
      expect(event2.args.gaslimit.toNumber()).to.equal(provableGasLimit)
    })

    it('only accepts calls with correct payment', async function () {
      const wrongPayment = registrationPrice - 1
      const call = pullRequests.register(pullRequestId, { value: wrongPayment })
      await expect(call).to.eventually.be.rejected()
    })

    it('only accepts callbacks from Provable', async function () {
      const notProvable = accounts[3]
      const call = pullRequests.__callback(0, '', '', { from: notProvable })
      await expect(call).to.be.rejected()
    })

    context('when Provable returns the user name', function () {
      async function usernameCallback (result) {
        await pullRequests.__callback(usernameQueryId, result, {
          from: provableAddress
        })
      }

      it('registers the creator when username is correct', async function () {
        await usernameCallback(creator)
        const username = await pullRequests.creator(pullRequestId)
        const hash = await pullRequests.creatorHash(pullRequestId)
        expect(username).to.equal(creator)
        expect(hash).to.equal(web3.utils.keccak256(creator))
      })

      it('does not register when username is incorrect', async function () {
        await usernameCallback('incorrect_user')
        const username = await pullRequests.creator(pullRequestId)
        const hash = await pullRequests.creatorHash(pullRequestId)
        expect(username).to.equal('')
        expect(hexToNumber(hash)).to.equal(0)
      })

      it('only processes a query result once', async function () {
        await usernameCallback('some result')
        await expect(usernameCallback('some result')).to.be.rejected()
      })
    })

    context('when Provable returns the merged state', function () {
      async function mergedStateCallback (result) {
        await pullRequests.__callback(mergedStateQueryId, result, {
          from: provableAddress
        })
      }

      it('registers that pull request is merged', async function () {
        await mergedStateCallback('true')
        expect(await pullRequests.isMerged(pullRequestId)).to.equal(true)
      })

      it('does not register when pull request is not merged', async function () {
        await mergedStateCallback('false')
        expect(await pullRequests.isMerged(pullRequestId)).to.equal(false)
      })

      it('only processes a query result once', async function () {
        await mergedStateCallback('some result')
        await expect(mergedStateCallback('some result')).to.be.rejected()
      })
    })
  })

  function toBytes32 (number) {
    let result = number.toString(16)
    while (result.length < 64) {
      result = '00' + result
    }
    return '0x' + result
  }
})
