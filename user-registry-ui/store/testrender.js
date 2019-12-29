import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { createStore } from './store'

export const renderWithRedux = (component, state) => ({
  ...render(<Provider store={createStore(state)} >{component}</Provider>)
})
