import { post } from '@sustainablesource/github-requests'

export async function createGist ({ accessToken, options }) {
  await post('/gists', accessToken, options)
}
