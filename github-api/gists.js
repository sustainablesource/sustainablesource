import { post } from './requests'

export async function createGist ({ accessToken, options }) {
  await post('/gists', accessToken, options)
}
