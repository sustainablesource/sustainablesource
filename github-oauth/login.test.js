import { simulator } from 'now-we-test'
import { authorizeUrl } from './github-url'
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
  const location = response.headers.location
  expect(new URL(location).searchParams.get('client_id')).toEqual(clientId)
})

it('includes a unique state', async () => {
  const response1 = await app.get('/')
  const response2 = await app.get('/')
  const state1 = new URL(response1.headers.location).searchParams.get('state')
  const state2 = new URL(response2.headers.location).searchParams.get('state')
  expect(state1).not.toEqual(state2)
})

it('stores the state in a cookie', async () => {
  const response = await app.get('/')
  const urlState = new URL(response.headers.location).searchParams.get('state')
  const cookieState = cookie.parse(response.headers['set-cookie'][0]).state
  expect(cookieState).toEqual(urlState)
})
