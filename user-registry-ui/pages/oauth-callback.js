import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from '../store'
import { OAuthCallback } from '../github/oauth'

const store = createStore()

const Callback = () => (
  <Provider store={store}>
    <OAuthCallback />
  </Provider>
)

export default Callback
