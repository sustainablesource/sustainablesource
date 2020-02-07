import { createAction } from 'redux-starter-kit'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { infuraId } from '../infura'

export const storeAccount = createAction('ethereum/account/store')
export const connected = createAction('ethereum/wallet/connect')
export const disconnected = createAction('ethereum/wallet/disconnect')
export const signalWalletError = createAction('ethereum/wallet/error')

export const connectToWallet = () => async dispatch => {
  const provider = new WalletConnectProvider({ infuraId })
  provider.on('accountsChanged', ([account]) => {
    dispatch(storeAccount(account))
  })
  provider.on('open', () => {
    dispatch(connected())
  })
  provider.on('close', () => {
    dispatch(disconnected())
  })
  try {
    await provider.enable()
  } catch (error) {
    dispatch(signalWalletError(error.message))
  }
}
