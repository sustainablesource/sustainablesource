import React from 'react'
import Registration from './index'
import { render } from '@testing-library/react'

it('renders', () => {
  expect(() => render(<Registration />)).not.toThrow()
})
