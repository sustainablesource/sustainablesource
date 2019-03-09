import fetch from 'node-fetch'
import url from 'url'
import querystring from 'querystring'
import cookie from 'cookie'
import { accessTokenUrl } from './github-url'

export default async function (request, response) {
  let result
  try {
    checkState({ request })
    const { code } = url.parse(request.url, true).query
    result = await requestToken({ code })
  } catch (error) {
    result = { error: error.message }
  }
  redirect({ response, result })
}

function checkState ({ request }) {
  const queryState = url.parse(request.url, true).query.state
  const cookieState = extractStateFromCookie({ request })
  if (queryState !== cookieState) {
    throw new Error('state does not match cookie')
  }
}

function extractStateFromCookie ({ request }) {
  if (!request.headers.cookie) {
    throw new Error('missing state cookie')
  }
  return cookie.parse(request.headers.cookie).state
}

async function requestToken ({ code }) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  const response = await fetch(accessTokenUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    })
  })
  return response.json()
}

function redirect ({ response, result }) {
  const callbackUrl = process.env.CALLBACK_URL
  const location = `${callbackUrl}#${querystring.stringify(result)}`
  response.statusCode = 302
  response.setHeader('Location', location)
  response.end()
}
