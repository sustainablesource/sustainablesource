import { simulator } from 'now-we-test'
import { getGist } from '@sustainablesource/github-api'
import { mockOracleRequest, mockOracleResponse }
  from '@sustainablesource/user-registry'
import attestUser from './attest-user'

const app = simulator(attestUser)

const requestId = '42'
const accessToken = 'github_access_token'
const gistId = 'gist_id'
const account = '0xaccount'
const username = 'username'
const gist = {
  owner: { login: username },
  files: { attestation: { contents: account } }
}

const attest = async () =>
  await app
    .get('/')
    .query({ requestId })
    .set('Authorization', `token ${accessToken}`)

beforeEach(() => {
  mockOracleRequest.mockResolvedValue([gistId, account])
  getGist.mockResolvedValue(gist)
})

it('retrieves the request from the contract', async () => {
  await attest()
  expect(mockOracleRequest).toBeCalledWith(requestId)
})

it('retrieves the gist from github', async () => {
  await attest()
  expect(getGist).toBeCalledWith({ id: gistId, accessToken })
})

it('sends a positive attestation to the contract', async () => {
  await attest()
  expect(mockOracleResponse).toBeCalledWith(requestId, true, username)
})

it('sends a negative attestation when the gist cannot be loaded', async () => {
  getGist
    .mockRejectedValue(new Error())
  await attest()
  expect(mockOracleResponse).toBeCalledWith(requestId, false, '')
})

it('sends a negative attestation when the filename is incorrect', async () => {
  const wrong = {
    ...gist,
    files: { incorrect: { contents: account } }
  }
  getGist.mockResolvedValue(wrong)
  await attest()
  expect(mockOracleResponse).toBeCalledWith(requestId, false, '')
})

it('sends a negative attestation when the file is incorrect', async () => {
  const wrong = {
    ...gist,
    files: { attestation: { contents: 'incorrect' } }
  }
  getGist.mockResolvedValue(wrong)
  await attest()
  expect(mockOracleResponse).toBeCalledWith(requestId, false, '')
})

it('returns 400 when request id is not present', async () => {
  const response = await app.get('/')
    .set('Authorization', `token ${accessToken}`)
  expect(response.statusCode).toEqual(400)
})

it('returns 404 when request could not be found', async () => {
  mockOracleRequest
    .mockResolvedValue(['', '0x0000000000000000000000000000000000000000'])
  const response = await attest()
  expect(response.statusCode).toEqual(404)
})

it('returns 404 when request retrieval fails', async () => {
  mockOracleRequest.mockRejectedValue(new Error())
  const response = await attest()
  expect(response.statusCode).toEqual(404)
})

it('returns 403 when an authorization header is not present', async () => {
  const response = await app.get('/')
    .query({ requestId })
  expect(response.statusCode).toEqual(403)
})

it('returns 400 when the authorization header is invalid', async () => {
  const response = await app.get('/')
    .query({ requestId })
    .set('Authorization', 'invalid')
  expect(response.statusCode).toEqual(400)
})

it('returns 500 when an error is thrown', async () => {
  mockOracleResponse.mockRejectedValue(new Error())
  const response = await attest()
  expect(response.statusCode).toEqual(500)
})
