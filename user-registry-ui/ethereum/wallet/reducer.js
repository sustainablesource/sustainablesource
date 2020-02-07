import { combineReducers } from 'redux'
import { createReducer } from 'redux-starter-kit'
import { storeAccount, connected, disconnected, signalWalletError }
  from './actions'

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
  connected: connectionReducer,
  account: accountReducer,
  error: errorReducer
})
