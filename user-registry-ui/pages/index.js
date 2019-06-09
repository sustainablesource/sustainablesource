import React from 'react'
import 'semantic-ui-offline/semantic.min.css'
import { configureStore } from 'redux-starter-kit'
import { Provider } from 'react-redux'
import { Wizard } from '../wizard'
import { githubReducer } from '../github'

const store = configureStore({ reducer: {
  github: githubReducer
} })

const Registration = () => (
  <Provider store={store}>
    <Wizard />
  </Provider>
)

export default Registration
