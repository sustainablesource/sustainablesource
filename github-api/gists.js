import { post } from '@sustainablesource/github-requests'

export async function createGist ({ accessToken, options }) {
  return (await post('/gists', accessToken, options)).id
}
