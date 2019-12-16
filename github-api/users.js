import fetch from 'cross-fetch'
import { HttpError } from './HttpError'

export async function retrieveUsername ({ accessToken }) {
  const headers = {
    Authorization: `token ${accessToken}`,
    Accept: 'application/json'
  }
  const response = await fetch('https://api.github.com/user', { headers })
  if (!response.ok) {
    const json = await response.json()
    const status = response.status
    const message = json.message
    throw new HttpError({ status, message })
  }
  const json = await response.json()
  return json.login
}
