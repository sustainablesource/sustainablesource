import fetchMock from 'node-fetch'
import { retrieveUsername } from './users'
import { HttpError } from './HttpError'

describe('retrieving the github username', () => {
  const url = 'https://api.github.com/user'
  const username = 'some username'
  const accessToken = 'some_token'

  afterEach(() => {
    fetchMock.restore()
  })

  describe('success', () => {
    beforeEach(async () => {
      fetchMock.get(url, { login: username })
    })

    it('provides oauth authorization', async () => {
      await retrieveUsername({ accessToken })
      const authorization = fetchMock.lastOptions().headers['Authorization']
      expect(authorization).toEqual(`token ${accessToken}`)
    })

    it('requests a json response', async () => {
      await retrieveUsername({ accessToken })
      const accept = fetchMock.lastOptions().headers['Accept']
      expect(accept).toEqual('application/json')
    })

    it('sets the username', async () => {
      expect(await retrieveUsername({ accessToken })).toEqual(username)
    })
  })

  describe('failure', () => {
    const status = 404
    const message = 'not found'

    beforeEach(() => {
      fetchMock.get(url, { status, body: { message } })
    })

    it('throws on http errors', async () => {
      const retrieval = retrieveUsername({ accessToken })
      const expected = new HttpError({ status, message })
      await expect(retrieval).rejects.toStrictEqual(expected)
    })
  })
})
