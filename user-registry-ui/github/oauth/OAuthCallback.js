import React from 'react'
import { connect } from 'react-redux'
import querystring from 'querystring'
import { storeOAuthToken } from '../actions'

class OAuthCallback extends React.Component {
  componentDidMount () {
    const { storeOAuthToken } = this.props
    storeOAuthToken(extractToken())
    window.location.assign('/')
  }

  render () {
    return null
  }
}

function extractToken () {
  const query = querystring.parse(window.location.hash.slice(1))
  return query.access_token
}

export default connect(null, { storeOAuthToken })(OAuthCallback)
