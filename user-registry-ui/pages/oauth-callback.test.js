import React from 'react'
import OAuthCallback from './oauth-callback'
import { render } from '@testing-library/react'

it('renders', () => {
  expect(() => render(<OAuthCallback />)).not.toThrow()
})
