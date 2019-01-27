import { simulator } from 'now-we-test'
import { authorizeUrl } from './github-url'
import url from 'url'
import cookie from 'cookie'
import login from './login'
const { stringContaining } = expect

const app = simulator(login)

it('redirects to github', async () => {
  const response = await app.get('/')
  expect(response.statusCode).toEqual(302)
  expect(response.headers.location).toEqual(stringContaining(authorizeUrl))
})

it('includes the client id', async () => {
  const clientId = 'SomeClientId'
  process.env.GITHUB_CLIENT_ID = clientId
  const response = await app.get('/')
  expect(response.headers.location).toEqual(stringContaining(clientId))
})

it('includes a unique state', async () => {
  const response1 = await app.get('/')
  const response2 = await app.get('/')
  const state1 = url.parse(response1.headers.location, true).query.state
  const state2 = url.parse(response2.headers.location, true).query.state
  expect(state1).not.toEqual(state2)
})

it('stores the state in a cookie', async () => {
  const response = await app.get('/')
  const urlState = url.parse(response.headers.location, true).query.state
  const cookieState = cookie.parse(response.headers['set-cookie'][0]).state
  expect(cookieState).toEqual(urlState)
})
