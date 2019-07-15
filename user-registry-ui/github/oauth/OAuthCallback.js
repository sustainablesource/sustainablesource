import React from 'react'
import { connect } from 'react-redux'
import querystring from 'querystring'
import { storeOAuthToken } from '../actions'

class OAuthCallback extends React.Component {
  componentDidMount () {
    const token = extractToken()
    if (token) {
      const { storeOAuthToken } = this.props
      storeOAuthToken(token)
      removeHashFromUrl()
    }
  }

  render () {
    return null
  }
}

function extractToken () {
  const query = querystring.parse(window.location.hash.slice(1))
  return query.access_token
}

function removeHashFromUrl () {
  window.history.replaceState({}, '', window.location.href.replace(/#.*$/, ''))
}

export default connect(null, { storeOAuthToken })(OAuthCallback)
