import { githubReducer } from './reducer'
import { storeOAuthToken, clearOAuthToken } from './actions'

const objectContaining = expect.objectContaining

const token = 'some_access_token'

it('stores an oauth token', () => {
  const action = storeOAuthToken(token)
  const state = githubReducer({}, action)
  expect(state).toEqual(objectContaining({ oauthToken: token }))
})

it('clears the oauth token', () => {
  const action = clearOAuthToken()
  const state = githubReducer({ oauthToken: token }, action)
  expect(state.oauthToken).toBeUndefined()
})

it('does not overwrite an existing token', () => {
  const action = storeOAuthToken('some_other_token')
  const state = githubReducer({ oauthToken: token }, action)
  expect(state).toEqual(objectContaining({ oauthToken: token }))
})
