import fetch from 'cross-fetch'
import { HttpError } from './HttpError'

export async function createGist ({ accessToken, options }) {
  const url = 'https://api.github.com/gists'
  const method = 'POST'
  const headers = {
    Authorization: `token ${accessToken}`,
    Accept: 'application/json'
  }
  const body = JSON.stringify(options)
  const response = await fetch(url, { method, headers, body })
  if (!response.ok) {
    const json = await response.json()
    const status = response.status
    const message = json.message
    throw new HttpError({ status, message })
  }
}
