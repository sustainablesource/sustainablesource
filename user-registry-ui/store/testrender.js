import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { createStore } from './store'

export const renderWithRedux = (component, state) => {
  const store = createStore(state)
  return {
    ...render(<Provider store={store} >{component}</Provider>),
    store
  }
}
