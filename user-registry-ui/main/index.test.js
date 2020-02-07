import React from 'react'
import Main from './index'
import { render } from '@testing-library/react'

it('renders', () => {
  expect(() => render(<Main />)).not.toThrow()
})
