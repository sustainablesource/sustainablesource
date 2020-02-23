import { newWeb3Id } from './actions'
import { web3Reducer } from "./reducer"

it('creates a random web3 id initially', () => {
  const state = web3Reducer({}, {})
  expect(state.id).toBeDefined()
})

it('creates a new random web3 id when asked', () => {
  let state = web3Reducer({}, {})
  const old = state.id
  state = web3Reducer(state, newWeb3Id())
  expect(state.id).not.toEqual(old)
})
