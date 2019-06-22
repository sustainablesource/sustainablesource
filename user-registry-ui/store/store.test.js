import { createStore } from './store'

const localStorage = window.localStorage
const objectContaining = expect.objectContaining

it('persists to local storage', () => {
  const store = createStore()
  const action = { type: 'SOME_ACTION' }
  store.dispatch(action)
  expect(localStorage['store']).toBeDefined()
})

it('loads from local storage', () => {
  const storedState = { github: { oauth: { some: 'state' } } }
  localStorage.setItem('store', JSON.stringify(storedState))
  const store = createStore()
  expect(store.getState()).toEqual(objectContaining(storedState))
})
