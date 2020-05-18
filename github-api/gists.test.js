import { post, get, del } from '@sustainablesource/github-requests'
import { createGist, getGist, deleteGist } from './gists'

const accessToken = 'some_token'
const id = 'some_id'
const gist = {
  description: 'some gist',
  files: { some_file_name: 'some content' }
}

it('creates a gist', async () => {
  post.mockResolvedValue({ id })
  expect(await createGist({ accessToken, options: gist })).toEqual(id)
  expect(post).toBeCalledWith('/gists', accessToken, gist)
})

it('retrieves a gist', async () => {
  get.mockResolvedValue(gist)
  expect(await getGist({ accessToken, id })).toEqual(gist)
  expect(get).toBeCalledWith(`/gists/${id}`, accessToken)
})

it('deletes a gist', async () => {
  await deleteGist({ accessToken, id })
  expect(del).toBeCalledWith(`/gists/${id}`, accessToken)
})
