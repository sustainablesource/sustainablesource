import React from 'react'
import { render } from 'react-testing-library'
import { Github } from './Github'
import { loginUrl } from '@sustainablesource/github-oauth'

describe('login button', () => {
  beforeEach(() => {
    window.location.assign = jest.fn()
  })

  afterEach(() => {
    window.location.assign.mockRestore()
  })

  it('forwards to Github OAuth page', async () => {
    const { getByText } = render(<Github />)
    getByText('login to Github').click()
    expect(window.location.assign).toHaveBeenCalledWith(loginUrl)
  })
})
