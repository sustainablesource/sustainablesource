import { retrieveUsername } from '@sustainablesource/github-api'
import { getGithubOAuthToken } from './selectors'
import { storeUsername, clearUsername } from './actions'

export const usernameRetriever = store => next => async action => {
  const oldToken = getGithubOAuthToken(store.getState())
  next(action)
  const newToken = getGithubOAuthToken(store.getState())
  if (oldToken !== newToken) {
    if (newToken) {
      const username = await retrieveUsername({ accessToken: newToken })
      store.dispatch(storeUsername(username))
    } else {
      store.dispatch(clearUsername())
    }
  }
}
