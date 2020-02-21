import { combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'
import { storeAttestationId, clearAttestationId } from './actions'

export const attestationReducer = createReducer(null, {
  [storeAttestationId]: (_, action) => action.payload,
  [clearAttestationId]: () => null
})

export const registrationReducer = combineReducers({
  attestationId: attestationReducer
})
