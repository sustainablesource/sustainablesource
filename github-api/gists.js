import { post, get, del } from '@sustainablesource/github-requests'

export async function createGist ({ accessToken, options }) {
  return (await post('/gists', accessToken, options)).id
}

export async function getGist ({ accessToken, id }) {
  return get(`/gists/${id}`, accessToken)
}

export async function deleteGist ({ accessToken, id }) {
  await del(`/gists/${id}`, accessToken)
}
