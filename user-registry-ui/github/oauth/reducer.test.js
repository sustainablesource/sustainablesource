import { oauthReducer } from './reducer'
import { storeOAuthToken, clearOAuthToken } from './actions'

const objectContaining = expect.objectContaining

const token = 'some_access_token'

it('stores an oauth token', () => {
  const action = storeOAuthToken(token)
  const state = oauthReducer({}, action)
  expect(state).toEqual(objectContaining({ accessToken: token }))
})

it('clears the oauth token', () => {
  const action = clearOAuthToken()
  const state = oauthReducer({ accessToken: token }, action)
  expect(state.oauthToken).toBeUndefined()
})

it('does not overwrite an existing token', () => {
  const action = storeOAuthToken('some_other_token')
  const state = oauthReducer({ accessToken: token }, action)
  expect(state).toEqual(objectContaining({ accessToken: token }))
})
