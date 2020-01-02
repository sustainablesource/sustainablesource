import {
  connectToWallet, storeWalletUri, storeAccount, signalWalletError, disconnected
} from './actions'
import WalletConnect, {
  mockUri, mockConnected, mockAccounts, mockCreateSession, mockEvent
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

  it('stores the ethereum account when connect event arrives', async () => {
    const payload = { params: [{ accounts: [account], chainId: null }] }
    await action(dispatch)
    mockEvent({ name: 'connect', payload })
    expect(dispatch).toBeCalledWith(storeAccount(account))
  })

  it('signals errors from the connect event listener', async () => {
    const error = 'some error'
    await action(dispatch)
    mockEvent({ name: 'connect', error })
    expect(dispatch).toBeCalledWith(signalWalletError(error))
  })

  it('stores the ethereum account when session update arrives', async () => {
    const payload = { params: [{ accounts: [account], chainId: null }] }
    await action(dispatch)
    mockEvent({ name: 'session_update', payload })
    expect(dispatch).toBeCalledWith(storeAccount(account))
  })

  it('signals when disconnected', async () => {
    await action(dispatch)
    mockEvent({ name: 'disconnect' })
    expect(dispatch).toBeCalledWith(disconnected())
  })
})
