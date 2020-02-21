import { createAction } from '@reduxjs/toolkit'
import { getWeb3Provider } from './provider'

export const storeAccount = createAction('ethereum/account/store')
export const connected = createAction('ethereum/wallet/connect')
export const disconnected = createAction('ethereum/wallet/disconnect')
export const signalWalletError = createAction('ethereum/wallet/error')

export const connectToWallet = () => async dispatch => {
  const provider = getWeb3Provider()
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
