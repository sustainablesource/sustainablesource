import { combineReducers } from 'redux'
import { createReducer } from 'redux-starter-kit'
import { storeAttestationId } from './actions'

export const attestationReducer = createReducer(null, {
  [storeAttestationId]: (_, action) => action.payload
})

export const registrationReducer = combineReducers({
  attestationId: attestationReducer
})
