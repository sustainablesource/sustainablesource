import { authorizeUrl } from './github-url'
import uuid from 'uuid/v4'

export default function (request, response) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const state = uuid()
  const location = `${authorizeUrl}?client_id=${clientId}&state=${state}`
  response.statusCode = 302
  response.setHeader('Location', location)
  response.setHeader('Set-Cookie', [`state=${state}`])
  response.end()
}
