import { combineReducers } from 'redux'
import { createReducer } from 'redux-starter-kit'
import { storeWalletUri } from './actions'

export const walletReducer = createReducer(null, {
  [storeWalletUri]: (_, action) => action.payload
})

export const ethereumReducer = combineReducers({
  wallet: walletReducer
})
