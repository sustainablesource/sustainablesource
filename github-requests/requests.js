import fetch from 'cross-fetch'

const url = 'https://api.github.com'

export async function get (path, accessToken) {
  return request('GET', path, accessToken)
}

export async function post (path, accessToken, body) {
  return request('POST', path, accessToken, body)
}

export async function del (path, accessToken) {
  return request('DELETE', path, accessToken)
}

export class HttpError extends Error {
  constructor ({ status, message }) {
    super(`${status}: ${message}`)
    this.name = this.constructor.name
  }
}

async function request (method, path, accessToken, body = undefined) {
  let options = { method, headers: headers(accessToken, body) }
  if (body) {
    options = { ...options, body: JSON.stringify(body) }
  }
  const response = await fetch(`${url}${path}`, options)
  await handleError(response)
  return response.json()
}

function headers (accessToken, body = undefined) {
  let result = {
    Authorization: `token ${accessToken}`,
    Accept: 'application/json'
  }
  if (body) {
    result = { ...result, 'Content-Type': 'application/json' }
  }
  return result
}

async function handleError (response) {
  if (!response.ok) {
    const json = await response.json()
    const status = response.status
    const message = json.message
    throw new HttpError({ status, message })
  }
}
