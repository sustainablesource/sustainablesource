import { post, del } from '@sustainablesource/github-requests'
import { createGist, deleteGist } from './gists'

const accessToken = 'some_token'
const options = {
  description: 'some gist',
  files: { some_file_name: 'some content' }
}
const id = 'some id'

it('creates a gist', async () => {
  post.mockResolvedValue({ id })
  expect(await createGist({ accessToken, options })).toEqual(id)
  expect(post).toBeCalledWith('/gists', accessToken, options)
})

it('deletes a gist', async () => {
  await deleteGist({ accessToken, id })
  expect(del).toBeCalledWith(`/gists/${id}`, accessToken)
})
