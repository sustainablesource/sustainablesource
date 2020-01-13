import { post } from '@sustainablesource/github-requests'
import { createGist } from './gists'

const accessToken = 'some_token'
const options = {
  description: 'some gist',
  files: { 'some_file_name': 'some content' }
}

it('creates a gist', async () => {
  await createGist({ accessToken, options })
  expect(post).toBeCalledWith('/gists', accessToken, options)
})
