import { configureStore } from 'redux-starter-kit'
import { githubReducer } from './github'
import { ethereumReducer } from './ethereum'

export const createStore = () => configureStore({
  reducer: {
    github: githubReducer,
    ethereum: ethereumReducer
  }
})
