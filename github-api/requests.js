import fetch from 'cross-fetch'
import { HttpError } from './HttpError'

const url = 'https://api.github.com'

export async function get (path, accessToken) {
  const response = await fetch(`${url}${path}`, {
    headers: headers(accessToken)
  })
  await handleError(response)
  return response.json()
}

export async function post (path, accessToken, body) {
  const response = await fetch(`${url}${path}`, {
    method: 'POST',
    headers: headers(accessToken),
    body: JSON.stringify(body)
  })
  await handleError(response)
  return response.json()
}

function headers (accessToken) {
  return {
    Authorization: `token ${accessToken}`,
    Accept: 'application/json'
  }
}

async function handleError (response) {
  if (!response.ok) {
    const json = await response.json()
    const status = response.status
    const message = json.message
    throw new HttpError({ status, message })
  }
}
