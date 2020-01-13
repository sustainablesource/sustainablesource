import { post, del } from '@sustainablesource/github-requests'

export async function createGist ({ accessToken, options }) {
  return (await post('/gists', accessToken, options)).id
}

export async function deleteGist ({ id }) {
  await del(`/gists/${id}`)
}
