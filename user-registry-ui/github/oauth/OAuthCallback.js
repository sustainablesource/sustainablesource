import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import querystring from 'querystring'
import { storeOAuthToken } from '../actions'

export const OAuthCallback = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const token = extractToken()
    if (token) {
      dispatch(storeOAuthToken(token))
      removeHashFromUrl()
    }
  }, [])
  return null
}

function extractToken () {
  const query = querystring.parse(window.location.hash.slice(1))
  return query.access_token
}

function removeHashFromUrl () {
  window.history.replaceState({}, '', window.location.href.replace(/#.*$/, ''))
}
