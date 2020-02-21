import { createReducer } from '@reduxjs/toolkit'
import { storeOAuthToken, clearOAuthToken } from './actions'

export const oauthReducer = createReducer({}, {
  [storeOAuthToken]: (state, action) => {
    if (!state.accessToken) {
      state.accessToken = action.payload
    }
  },
  [clearOAuthToken]: (state, action) => {
    delete state.accessToken
  }
})
