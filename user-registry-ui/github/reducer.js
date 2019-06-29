import { combineReducers } from 'redux'
import { createReducer } from 'redux-starter-kit'
import { oauthReducer } from './oauth/reducer'
import { storeUsername, clearUsername } from './actions'

const usernameReducer = createReducer(null, {
  [storeUsername]: (state, action) => action.payload,
  [clearUsername]: () => null
})

export const githubReducer = combineReducers({
  oauth: oauthReducer,
  username: usernameReducer
})
