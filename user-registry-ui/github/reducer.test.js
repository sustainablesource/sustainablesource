import { githubReducer } from './reducer'
import { storeUsername, clearUsername } from './actions'

const username = 'some name'

it('contains the oauth state', () => {
  const state = githubReducer({}, {})
  expect(state.oauth).toBeDefined()
})

it('sets the username', () => {
  const state = githubReducer({}, storeUsername(username))
  expect(state.username).toEqual(username)
})

it('clears the username', () => {
  const state = githubReducer({ username }, clearUsername())
  expect(state.username).toBeNull()
})
