import { connectToWallet, storeWalletUri, storeAccount } from './actions'
import WalletConnect, { mockUri, mockOn, mockConnected, mockCreateSession }
  from '@walletconnect/browser'

describe('connecting to a wallet', () => {
  const bridge = 'https://bridge.walletconnect.org'
  const uri = 'some:walletconnect:uri'

  let action
  let dispatch

  beforeEach(() => {
    action = connectToWallet()
    dispatch = jest.fn()
    mockUri(uri)
  })

  it('stores the wallet uri', async () => {
    await action(dispatch)
    expect(dispatch).toBeCalledWith(storeWalletUri(uri))
  })

  it('uses the walletconnect.org bridge', async () => {
    await action(dispatch)
    expect(WalletConnect).toBeCalledWith({ bridge })
  })

  it('creates a new session when not connected', async () => {
    await action(dispatch)
    expect(mockCreateSession).toBeCalled()
  })

  it('does not create a new session when connected', async () => {
    mockConnected(true)
    await action(dispatch)
    expect(mockCreateSession).not.toBeCalled()
  })

  describe('when connect event is received', () => {
    const account = '0xSomeAccount'
    const payload = { params: [{ accounts: [account], chainId: null }] }

    beforeEach(() => {
      mockOn.mockImplementation((event, callback) => {
        if (event === 'connect') {
          callback(null, payload)
        }
      })
    })

    it('stores the connected ethereum account', async () => {
      await action(dispatch)
      expect(dispatch).toBeCalledWith(storeAccount(account))
    })
  })
})
