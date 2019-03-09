import React from 'react'
import querystring from 'querystring'

export class OAuthCallback extends React.Component {
  componentDidMount () {
    const { accessToken, tokenType } = extractToken()
    if (!accessToken || !tokenType) { return }
    if (tokenAlreadyStored()) { return }
    storeToken({ accessToken, tokenType })
    removeHashFromUrl()
  }

  render () {
    return null
  }
}

function extractToken () {
  const query = querystring.parse(window.location.hash.slice(1))
  return { accessToken: query.access_token, tokenType: query.token_type }
}

function tokenAlreadyStored () {
  return !!window.localStorage.getItem('oauth')
}

function storeToken ({ accessToken, tokenType }) {
  const serialized = JSON.stringify({ accessToken, tokenType })
  window.localStorage.setItem('oauth', serialized)
}

function removeHashFromUrl () {
  window.location.assign(window.location.href.replace(/#.*$/, ''))
}
