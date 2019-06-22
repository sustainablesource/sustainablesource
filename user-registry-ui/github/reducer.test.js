import { githubReducer } from './reducer'

it('contains the oauth state', () => {
  const state = githubReducer({}, {})
  expect(state.oauth).toBeDefined()
})
