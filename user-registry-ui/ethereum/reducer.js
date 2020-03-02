import { combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'
import { newWeb3Id, storeAccount, connected, disconnected, signalWalletError }
  from './actions'

const uniqueId = Math.random

const idReducer = createReducer(uniqueId(), {
  [newWeb3Id]: () => uniqueId()
})

export const web3Reducer = combineReducers({
  id: idReducer
})

const connectionReducer = createReducer(null, {
  [connected]: () => true,
  [disconnected]: () => false
})

const accountReducer = createReducer(null, {
  [storeAccount]: (_, action) => action.payload,
  [disconnected]: () => null
})

const errorReducer = createReducer(null, {
  [signalWalletError]: (_, action) => action.payload,
  [connected]: () => null,
  [storeAccount]: () => null
})

export const ethereumReducer = combineReducers({
  web3: web3Reducer,
  connected: connectionReducer,
  account: accountReducer,
  error: errorReducer
})
