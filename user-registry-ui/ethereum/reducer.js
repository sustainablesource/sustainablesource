import { combineReducers } from '@reduxjs/toolkit'
import { walletReducer } from './wallet'
import { web3Reducer } from './web3'

export const ethereumReducer = combineReducers({
  wallet: walletReducer,
})
