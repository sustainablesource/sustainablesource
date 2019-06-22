import { combineReducers } from 'redux'
import { oauthReducer } from './oauth/reducer'

export const githubReducer = combineReducers({
  oauth: oauthReducer
})
