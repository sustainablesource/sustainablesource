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

it('stores the access token', () => {
  location.href += `#access_token=${token}`
  render(<OAuthCallback store={store} />)
  expect(store.getActions()).toEqual([storeOAuthToken(token)])
})

it('redirects to the main page', () => {
  render(<OAuthCallback store={store} />)
  expect(window.location.assign).toBeCalledWith('/')
})
