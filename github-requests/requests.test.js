import fetchMock from 'node-fetch'
import { get, post, del, HttpError } from './requests'

describe('http requests', () => {
  const accessToken = 'some_token'
  const path = '/some/path'
  const url = `https://api.github.com${path}`
  const result = { some: 'result' }

  describe('get', () => {
    describe('success', () => {
      let response

      beforeEach(async () => {
        fetchMock.get(url, result)
        response = await get(path, accessToken)
      })

      it('provides oauth authorization', checkAuthorization)
      it('requests a json response', checkAccept)

      it('returns the response', async () => {
        expect(response).toEqual(result)
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

  describe('post', () => {
    const body = { some: 'body' }

    describe('success', () => {
      let response

      beforeEach(async () => {
        fetchMock.post(url, result)
        response = await post(path, accessToken, body)
      })

      it('provides oauth authorization', checkAuthorization)
      it('requests a json response', checkAccept)
      it('sends json', checkContentType)

      it('sends the body', async () => {
        const sent = JSON.parse(fetchMock.lastOptions().body)
        expect(sent).toEqual(body)
      })

      it('returns the response', async () => {
        expect(response).toEqual(result)
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

  describe('delete', () => {
    describe('success', () => {
      let response

      beforeEach(async () => {
        fetchMock.delete(url, result)
        response = await del(path, accessToken)
      })

      it('provides oauth authorization', checkAuthorization)
      it('requests a json response', checkAccept)

      it('returns the response', async () => {
        expect(response).toEqual(result)
      })
    })

    describe('failure', () => {
      const status = 404
      const message = 'not found'

      beforeEach(() => {
        fetchMock.delete(url, { status, body: { message } })
      })

      it('throws on http errors', async () => {
        const retrieval = del(path, accessToken)
        const expected = new HttpError({ status, message })
        await expect(retrieval).rejects.toStrictEqual(expected)
      })
    })
  })

  function checkAuthorization () {
    const authorization = fetchMock.lastOptions().headers.Authorization
    expect(authorization).toEqual(`token ${accessToken}`)
  }

  function checkAccept () {
    const accept = fetchMock.lastOptions().headers.Accept
    expect(accept).toEqual('application/json')
  }

  function checkContentType () {
    const contentType = fetchMock.lastOptions().headers['Content-Type']
    expect(contentType).toEqual('application/json')
  }
})
