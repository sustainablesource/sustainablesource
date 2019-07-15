import React from 'react'
import OAuthCallback from './OAuthCallback'
import { render } from '@testing-library/react'
import { mockStore } from '../../store/mockStore'
import { storeOAuthToken } from '../actions'

const location = window.location

const token = 'some_access_token'

let store

beforeEach(() => {
  store = mockStore()
})

describe('when access token is present', () => {
  beforeEach(() => {
    location.href += `#access_token=${token}`
    render(<OAuthCallback store={store} />)
  })

  it('stores the access token', () => {
    expect(store.getActions()).toEqual([storeOAuthToken(token)])
  })

  it('removes the access token from the url', () => {
    expect(location.href).toEqual(location.origin + location.pathname)
  })
})

describe('when access token is absent', () => {
  let originalUrl

  beforeEach(() => {
    location.href += '#some_hash'
    originalUrl = location.href
    render(<OAuthCallback store={store} />)
  })

  it('does not store the access token', () => {
    expect(store.getActions()).toEqual([])
  })

  it('does not alter the url', () => {
    expect(location.href).toEqual(originalUrl)
  })
})
