import { get } from './requests'

export async function retrieveUsername ({ accessToken }) {
  return (await get('/user', accessToken)).login
}
