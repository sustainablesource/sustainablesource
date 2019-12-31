import { connectToWallet, storeWalletUri, storeAccount, signalWalletError }
  from './actions'
import WalletConnect, {
  mockUri, mockConnected, mockAccounts, mockCreateSession, mockOn
} from '@walletconnect/browser'

describe('connecting to a wallet', () => {
  const bridge = 'https://bridge.walletconnect.org'
  const uri = 'some:walletconnect:uri'
  const account = '0xSomeAccount'

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

  describe('when ethereum account is already connected', () => {
    beforeEach(() => {
      mockConnected(true)
      mockAccounts([account])
    })

    it('does not create a new session', async () => {
      await action(dispatch)
      expect(mockCreateSession).not.toBeCalled()
    })

    it('stores the connected ethereum account', async () => {
      await action(dispatch)
      expect(dispatch).toBeCalledWith(storeAccount(account))
    })
  })

  describe('when connect event is received', () => {
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

  describe('when connect event listener receives an error', () => {
    const error = 'some error'

    beforeEach(() => {
      mockOn.mockImplementation((event, callback) => {
        if (event === 'connect') {
          callback(error, null)
        }
      })
    })

    it('signals the error', async () => {
      await action(dispatch)
      expect(dispatch).toBeCalledWith(signalWalletError(error))
    })
  })
})
