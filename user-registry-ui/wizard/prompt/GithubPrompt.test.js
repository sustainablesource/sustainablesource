import React from 'react'
import { render } from '@testing-library/react'
import { loginUrl } from '@sustainablesource/github-oauth'
import { GithubPrompt } from './GithubPrompt'

it('forwards to the Github OAuth page when login button is pressed', () => {
  const { getByText } = render(<GithubPrompt />)
  getByText('Login to Github').click()
  expect(window.location.assign).toBeCalledWith(loginUrl)
})
