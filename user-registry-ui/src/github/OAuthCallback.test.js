import React from 'react'
import { render } from 'react-testing-library'
import { OAuthCallback } from './OAuthCallback'

const localStorage = window.localStorage
const location = window.location

describe('when access token in url', () => {
  const accessToken = 'some_access_token'
  const tokenType = 'some_token_type'

  beforeEach(() => {
    location.href += `#access_token=${accessToken}&token_type=${tokenType}`
  })

  it('stores the access token in local storage', () => {
    render(<OAuthCallback />)
    const serialized = JSON.stringify({ accessToken, tokenType })
    expect(localStorage.setItem).toBeCalledWith('oauth', serialized)
  })

  it('removes the access token from the url', () => {
    render(<OAuthCallback />)
    expect(location.assign).toBeCalledWith(location.origin + location.pathname)
  })

  it('does not overwrite an existing token', () => {
    localStorage.__STORE__['oauth'] = 'an_existing_token'
    render(<OAuthCallback />)
    expect(localStorage.setItem).not.toBeCalled()
  })
})

it('does nothing when access token is not present', () => {
  render(<OAuthCallback />)
  expect(localStorage.setItem).not.toBeCalled()
  expect(location.assign).not.toBeCalled()
})
