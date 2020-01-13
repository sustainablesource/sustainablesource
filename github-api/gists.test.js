import fetchMock from 'node-fetch'
import { HttpError } from './HttpError'
import { createGist } from './gists'

describe('creating a gist', () => {
  const url = 'https://api.github.com/gists'
  const accessToken = 'some_token'
  const options = {
    description: 'some gist',
    files: { 'some_file_name': 'some content' }
  }

  describe('success', () => {
    beforeEach(() => {
      fetchMock.post(url, {})
    })

    it('provides oauth authorization', async () => {
      await createGist({ accessToken, options })
      const authorization = fetchMock.lastOptions().headers['Authorization']
      expect(authorization).toEqual(`token ${accessToken}`)
    })

    it('requests a json response', async () => {
      await createGist({ accessToken, options })
      const accept = fetchMock.lastOptions().headers['Accept']
      expect(accept).toEqual('application/json')
    })

    it('sends json', async () => {
      await createGist({ accessToken, options })
      const contentType = fetchMock.lastOptions().headers['Content-Type']
      expect(contentType).toEqual('application/json')
    })

    it('sends the gist options', async () => {
      await createGist({ accessToken, options })
      const body = JSON.parse(fetchMock.lastOptions().body)
      expect(body).toEqual(options)
    })
  })

  describe('failure', () => {
    const status = 404
    const message = 'not found'

    beforeEach(() => {
      fetchMock.post(url, { status, body: { message } })
    })

    it('throws on http errors', async () => {
      const creation = createGist({ accessToken, options })
      const expected = new HttpError({ status, message })
      await expect(creation).rejects.toStrictEqual(expected)
    })
  })
})
