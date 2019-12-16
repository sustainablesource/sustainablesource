import { createAction } from 'redux-starter-kit'
import * as githubApi from '@sustainablesource/github-api'

export * from './oauth/actions'

export const retrieveUsername = ({ accessToken }) => async (dispatch) => {
  const username = await githubApi.retrieveUsername({ accessToken })
  dispatch(storeUsername(username))
}

export const storeUsername = createAction('github/username/store')
export const clearUsername = createAction('github/username/clear')
