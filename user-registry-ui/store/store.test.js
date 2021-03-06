import { createStore } from './store'
import { storeOAuthToken } from '../github/actions'

const localStorage = window.localStorage

it('persists to local storage', () => {
  const store = createStore()
  const action = { type: 'SOME_ACTION' }
  store.dispatch(action)
  expect(localStorage.store).toBeDefined()
})

it('loads from local storage', () => {
  const store = createStore()
  store.dispatch(storeOAuthToken('some_token'))
  const loadedStore = createStore()
  expect(loadedStore.getState()).toEqual(store.getState())
})

describe('when local storage is absent', () => {
  let localStorage

  beforeEach(() => {
    localStorage = window.localStorage
    delete window.localStorage
  })

  afterEach(() => {
    window.localStorage = localStorage
  })

  it('can create a store', () => {
    expect(() => createStore()).not.toThrow()
  })
})
