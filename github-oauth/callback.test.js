import { simulator } from 'now-we-test'
import fetchMock from 'node-fetch'
import callback from './callback'
import { accessTokenUrl } from './github-url'

const { stringContaining } = expect

const callbackUrl = 'http://some.host'
const clientId = 'some client id'
const clientSecret = 'some client secret'
const temporaryCode = 'some_temporary_code'
const state = 'some state'
const accessToken = 'some_access_token'
const tokenType = 'some_token_type'

let app

beforeEach(() => {
  process.env.CALLBACK_URL = callbackUrl
  process.env.GITHUB_CLIENT_ID = clientId
  process.env.GITHUB_CLIENT_SECRET = clientSecret
  app = simulator(callback)
})

function mockGithubOAuth () {
  fetchMock.post(accessTokenUrl, {
    access_token: accessToken,
    token_type: tokenType
  })
}

async function callCallback () {
  return app
    .get(`/?code=${temporaryCode}&state=${state}`)
    .set('Cookie', `state=${state}`)
}

describe('posting to Github', () => {
  beforeEach(async () => {
    mockGithubOAuth()
    await callCallback()
  })

  it('posts json', async () => {
    const contentType = fetchMock.lastOptions().headers['Content-Type']
    expect(contentType).toEqual('application/json')
  })

  it('requests a json response', () => {
    const accept = fetchMock.lastOptions().headers.Accept
    expect(accept).toEqual('application/json')
  })

  describe('json body', () => {
    let body

    beforeEach(() => {
      body = JSON.parse(fetchMock.lastOptions().body)
    })

    it('posts the client id', async () => {
      expect(body.client_id).toEqual(clientId)
    })

    it('posts the client secret', async () => {
      expect(body.client_secret).toEqual(clientSecret)
    })

    it('posts the temporary code', async () => {
      expect(body.code).toEqual(temporaryCode)
    })
  })
})

it('redirects to the callback url', async () => {
  mockGithubOAuth()
  const response = await callCallback()
  expect(response.statusCode).toEqual(302)
  expect(response.headers.location).toEqual(stringContaining(callbackUrl))
})

describe('access token', () => {
  let url

  beforeEach(async () => {
    mockGithubOAuth()
    const response = await callCallback()
    url = response.headers.location
  })

  it('forwards the access token', async () => {
    expect(url).toEqual(stringContaining(accessToken))
  })

  it('forwards the token type', async () => {
    expect(url).toEqual(stringContaining(tokenType))
  })

  it('uses the fragment identifier for the access token', async () => {
    expect(url.indexOf('#')).not.toBe(-1)
    expect(url.indexOf('#')).toBeLessThan(url.indexOf(accessToken))
  })
})

it('returns an error when returned state does not match cookie', async () => {
  mockGithubOAuth()
  const response = await app
    .get('/?state=some_state')
    .set('Cookie', 'state=other_state')
  const url = response.header.location
  expect(url).toEqual(stringContaining('error='))
})

it('returns Github errors', async () => {
  fetchMock.post(accessTokenUrl, {
    status: 403,
    body: { error: 'github_error' }
  })
  const response = await callCallback()
  const url = response.headers.location
  expect(url).toEqual(stringContaining('error=github_error'))
})

it('returns connection errors', async () => {
  fetchMock.post(accessTokenUrl, {
    throws: new Error('connection_error')
  })
  const response = await callCallback()
  const url = response.headers.location
  expect(url).toEqual(stringContaining('error=connection_error'))
})
