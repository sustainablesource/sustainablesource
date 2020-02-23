import { createReducer, combineReducers } from '@reduxjs/toolkit'
import { newWeb3Id } from './actions'

const uniqueId = Math.random

const idReducer = createReducer(uniqueId(), {
  [newWeb3Id]: () => uniqueId()
})

export const web3Reducer = combineReducers({
  id: idReducer
})
