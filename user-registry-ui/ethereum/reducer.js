import { combineReducers } from 'redux'
import { createReducer } from 'redux-starter-kit'
import { storeWalletUri, storeAccount, disconnected, signalWalletError }
  from './actions'

const walletReducer = createReducer(null, {
  [storeWalletUri]: (_, action) => action.payload,
  [disconnected]: () => null
})

const accountReducer = createReducer(null, {
  [storeAccount]: (_, action) => action.payload,
  [disconnected]: () => null
})

const errorReducer = createReducer(null, {
  [signalWalletError]: (_, action) => action.payload,
  [storeWalletUri]: () => null,
  [storeAccount]: () => null
})

export const ethereumReducer = combineReducers({
  wallet: walletReducer,
  account: accountReducer,
  error: errorReducer
})
