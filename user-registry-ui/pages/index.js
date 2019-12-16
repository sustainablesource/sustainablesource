import React from 'react'
import 'semantic-ui-offline/semantic.min.css'
import { Provider } from 'react-redux'
import { OAuthCallback } from '../github/oauth'
import { Wizard } from '../wizard'
import { createStore } from '../store'

const store = createStore()

const Registration = () => (
  <Provider store={store}>
    <OAuthCallback />
    <Wizard />
  </Provider>
)

export default Registration
