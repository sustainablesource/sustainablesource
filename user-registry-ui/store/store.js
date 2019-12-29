import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import { load, save } from 'redux-localstorage-simple'
import { githubReducer } from '../github'
import { ethereumReducer } from '../ethereum'
import { usernameRetriever } from '../github/middleware'

export const createStore = state => configureStore({
  reducer: {
    github: githubReducer,
    ethereum: ethereumReducer
  },
  preloadedState: state || loadIfPossible({ namespace: 'store' }),
  middleware: [
    ...getDefaultMiddleware(),
    usernameRetriever,
    save({ namespace: 'store' })
  ]
})

const loadIfPossible = (...args) => {
  if (typeof window !== typeof undefined && window.localStorage) {
    return load(...args)
  }
}
