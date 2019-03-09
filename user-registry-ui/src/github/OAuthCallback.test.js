import React from 'react'
import { render } from 'react-testing-library'
import { OAuthCallback } from './OAuthCallback'

const localStorage = window.localStorage
const location = window.location

const accessToken = 'some_access_token'
const tokenType = 'some_token_type'

let originalLocation

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem.mockClear()
  originalLocation = location.href
  location.assign = jest.fn()
})

afterEach(() => {
  location.href = originalLocation
})

it('stores the access token in local storage', () => {
  location.href += `#access_token=${accessToken}&token_type=${tokenType}`
  render(<OAuthCallback />)
  const serialized = JSON.stringify({ accessToken, tokenType })
  expect(localStorage.setItem).toBeCalledWith('oauth', serialized)
})

it('removes the access token from the url', () => {
  const originalUrl = location.href
  location.href += `#access_token=${accessToken}&token_type=${tokenType}`
  render(<OAuthCallback />)
  expect(location.assign).toBeCalledWith(originalUrl)
})

it('does nothing when access token is not present', () => {
  render(<OAuthCallback />)
  expect(localStorage.setItem).not.toBeCalled()
  expect(location.assign).not.toBeCalled()
})

it('does not overwrite an existing token', () => {
  localStorage.__STORE__['oauth'] = 'an_existing_token'
  location.href += `#access_token=${accessToken}&token_type=${tokenType}`
  render(<OAuthCallback />)
  expect(localStorage.setItem).not.toBeCalled()
})
