import fetch from 'cross-fetch'
import { HttpError } from './HttpError'

const url = 'https://api.github.com'

export async function get (path, accessToken) {
  const response = await fetch(`${url}${path}`, {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: 'application/json'
    }
  })
  if (!response.ok) {
    const json = await response.json()
    const status = response.status
    const message = json.message
    throw new HttpError({ status, message })
  }
  return response.json()
}

export async function post (path, accessToken, body) {
  const response = await fetch(`${url}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    const json = await response.json()
    const status = response.status
    const message = json.message
    throw new HttpError({ status, message })
  }
  return response.json()
}
