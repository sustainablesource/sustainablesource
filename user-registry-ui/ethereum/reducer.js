import { combineReducers } from 'redux'
import { createReducer } from 'redux-starter-kit'
import { storeWalletUri, storeAccount, signalWalletError } from './actions'

const walletReducer = createReducer(null, {
  [storeWalletUri]: (_, action) => action.payload
})

const accountReducer = createReducer(null, {
  [storeAccount]: (_, action) => action.payload
})

const errorReducer = createReducer(null, {
  [signalWalletError]: (_, action) => action.payload.message
})

export const ethereumReducer = combineReducers({
  wallet: walletReducer,
  account: accountReducer,
  error: errorReducer
})
