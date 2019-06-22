import { createReducer } from 'redux-starter-kit'
import { storeOAuthToken, clearOAuthToken } from './actions'

export const oauthReducer = createReducer({}, {
  [storeOAuthToken]: (state, action) => {
    if (!state.oauthToken) {
      state.oauthToken = action.payload
    }
  },
  [clearOAuthToken]: (state, action) => {
    delete state.oauthToken
  }
})
