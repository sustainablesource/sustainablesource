import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import { load, save } from 'redux-localstorage-simple'
import { githubReducer } from '../github'
import { ethereumReducer } from '../ethereum'

export const createStore = () => configureStore({
  reducer: {
    github: githubReducer,
    ethereum: ethereumReducer
  },
  preloadedState: loadIfPossible({ namespace: 'store' }),
  middleware: [
    ...getDefaultMiddleware(),
    save({ namespace: 'store' })
  ]
})

const loadIfPossible = (...args) => {
  if (typeof window !== typeof undefined && window.localStorage) {
    return load(...args)
  }
}
