import React from 'react'
import { renderWithRedux } from '../../store/testrender'
import { getGithubOAuthToken } from '..'
import OAuthCallback from './OAuthCallback'

const location = window.location

const token = 'some_access_token'

describe('when access token is present', () => {
  let store

  beforeEach(() => {
    location.href += `#access_token=${token}`
    store = renderWithRedux(<OAuthCallback />).store
  })

  it('stores the access token', () => {
    expect(getGithubOAuthToken(store.getState())).toEqual(token)
  })

  it('removes the access token from the url', () => {
    expect(location.href).toEqual(location.origin + location.pathname)
  })
})

describe('when access token is absent', () => {
  let originalUrl
  let store

  beforeEach(() => {
    location.href += '#some_hash'
    originalUrl = location.href
    store = renderWithRedux(<OAuthCallback />).store
  })

  it('does not store the access token', () => {
    expect(getGithubOAuthToken(store.getState())).toBeUndefined()
  })

  it('does not alter the url', () => {
    expect(location.href).toEqual(originalUrl)
  })
})
