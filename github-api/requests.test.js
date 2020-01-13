import fetchMock from 'node-fetch'
import { get, HttpError } from './requests'

describe('http get request', () => {
  const accessToken = 'some_token'
  const path = '/some/path'
  const url = `https://api.github.com${path}`

  describe('success', () => {
    const result = { some: 'result' }

    beforeEach(() => {
      fetchMock.get(url, result)
    })

    it('provides oauth authorization', async () => {
      await get(path, accessToken)
      const authorization = fetchMock.lastOptions().headers['Authorization']
      expect(authorization).toEqual(`token ${accessToken}`)
    })

    it('requests a json response', async () => {
      await get(path, accessToken)
      const accept = fetchMock.lastOptions().headers['Accept']
      expect(accept).toEqual('application/json')
    })

    it('returns the response', async () => {
      expect(await get(path, accessToken)).toEqual(result)
    })
  })

  describe('failure', () => {
    const status = 404
    const message = 'not found'

    beforeEach(() => {
      fetchMock.get(url, { status, body: { message } })
    })

    it('throws on http errors', async () => {
      const retrieval = get(path, accessToken)
      const expected = new HttpError({ status, message })
      await expect(retrieval).rejects.toStrictEqual(expected)
    })
  })
})
