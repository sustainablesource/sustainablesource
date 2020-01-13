import fetchMock from 'node-fetch'
import { get, post, HttpError } from './requests'

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

describe('http post request', () => {
  const accessToken = 'some_token'
  const path = '/some/path'
  const url = `https://api.github.com${path}`
  const body = { some: 'body' }

  describe('success', () => {
    const result = { some: 'result' }

    beforeEach(() => {
      fetchMock.post(url, result)
    })

    it('provides oauth authorization', async () => {
      await post(path, accessToken, body)
      const authorization = fetchMock.lastOptions().headers['Authorization']
      expect(authorization).toEqual(`token ${accessToken}`)
    })

    it('requests a json response', async () => {
      await post(path, accessToken, body)
      const accept = fetchMock.lastOptions().headers['Accept']
      expect(accept).toEqual('application/json')
    })

    it('sends json', async () => {
      await post(path, accessToken, body)
      const contentType = fetchMock.lastOptions().headers['Content-Type']
      expect(contentType).toEqual('application/json')
    })

    it('sends the body', async () => {
      await post(path, accessToken, body)
      const sent = JSON.parse(fetchMock.lastOptions().body)
      expect(sent).toEqual(body)
    })

    it('returns the response', async () => {
      expect(await post(path, accessToken, body)).toEqual(result)
    })
  })

  describe('failure', () => {
    const status = 404
    const message = 'not found'

    beforeEach(() => {
      fetchMock.post(url, { status, body: { message } })
    })

    it('throws on http errors', async () => {
      const retrieval = post(path, accessToken, body)
      const expected = new HttpError({ status, message })
      await expect(retrieval).rejects.toStrictEqual(expected)
    })
  })
})
