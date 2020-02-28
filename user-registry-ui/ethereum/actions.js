import { createAction } from '@reduxjs/toolkit'
import { getWeb3 } from './getWeb3'

export const newWeb3Id = createAction('web3/id/new')
export const storeAccount = createAction('ethereum/account/store')
export const connected = createAction('ethereum/wallet/connect')
export const disconnected = createAction('ethereum/wallet/disconnect')
export const signalWalletError = createAction('ethereum/wallet/error')

export const connectToWallet = () => async (dispatch, getState) => {
  const web3 = getWeb3(getState(), dispatch)
  const provider = web3.currentProvider
  try {
    await provider.enable()
  } catch (error) {
    dispatch(signalWalletError(error.message))
  }
}
