import { connectToWallet, signalWalletError } from './actions'
import { mockEnable } from '@walletconnect/web3-provider'

describe('connecting to a wallet', () => {
  let action
  let dispatch
  let getState

  beforeEach(() => {
    action = connectToWallet()
    dispatch = jest.fn()
    getState = () => ({ ethereum: { web3: { id: Math.random() } } })
  })

  it('enables the wallet', async () => {
    await action(dispatch, getState)
    expect(mockEnable).toBeCalled()
  })

  it('signals errors while enabling the provider', async () => {
    const error = 'some error'
    mockEnable.mockRejectedValue(new Error(error))
    await action(dispatch, getState)
    expect(dispatch).toBeCalledWith(signalWalletError(error))
  })
})
