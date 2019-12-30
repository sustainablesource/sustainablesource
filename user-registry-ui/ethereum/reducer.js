import { combineReducers } from 'redux'
import { createReducer } from 'redux-starter-kit'
import { storeWalletUri, storeAccount } from './actions'

const walletReducer = createReducer(null, {
  [storeWalletUri]: (_, action) => action.payload
})

const accountReducer = createReducer(null, {
  [storeAccount]: (_, action) => action.payload
})

export const ethereumReducer = combineReducers({
  wallet: walletReducer,
  account: accountReducer
})
