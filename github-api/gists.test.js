import fetchMock from 'node-fetch'
import { createGist } from './gists'

const url = 'https://api.github.com/gists'
const accessToken = 'some_token'
const options = {
  description: 'some gist',
  files: { 'some_file_name': 'some content' }
}

it('creates a gist', async () => {
  fetchMock.post(url, {})
  await createGist({ accessToken, options })
  const body = JSON.parse(fetchMock.lastOptions().body)
  expect(body).toEqual(options)
})
