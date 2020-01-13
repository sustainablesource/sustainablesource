import { get } from '@sustainablesource/github-requests'

export async function retrieveUsername ({ accessToken }) {
  return (await get('/user', accessToken)).login
}
