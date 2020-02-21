import {
  connectToWallet, storeAccount, signalWalletError, connected, disconnected
} from './actions'
import { mockEvent, mockEnable } from '@walletconnect/web3-provider'

describe('connecting to a wallet', () => {
  const account = '0xSomeAccount'
  const error = 'some error'

  let action
  let dispatch

  beforeEach(() => {
    action = connectToWallet()
    dispatch = jest.fn()
  })

  it('stores the ethereum account when accounts change', async () => {
    await action(dispatch)
    mockEvent('accountsChanged', [account])
    expect(dispatch).toBeCalledWith(storeAccount(account))
  })

  it('signals errors while enabling the provider', async () => {
    mockEnable.mockRejectedValue(new Error(error))
    await action(dispatch)
    expect(dispatch).toBeCalledWith(signalWalletError(error))
  })

  it('signals when connected', async () => {
    await action(dispatch)
    mockEvent('open')
    expect(dispatch).toBeCalledWith(connected())
  })

  it('signals when disconnected', async () => {
    await action(dispatch)
    mockEvent('close', 42, 'some reason')
    expect(dispatch).toBeCalledWith(disconnected())
  })
})
