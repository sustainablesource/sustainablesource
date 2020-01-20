import { post, del } from '@sustainablesource/github-requests'

export async function createGist ({ accessToken, options }) {
  return (await post('/gists', accessToken, options)).id
}

export async function deleteGist ({ accessToken, id }) {
  await del(`/gists/${id}`, accessToken)
}
