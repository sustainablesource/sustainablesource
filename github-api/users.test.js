import fetchMock from 'node-fetch'
import { retrieveUsername } from './users'

const url = 'https://api.github.com/user'
const accessToken = 'some_token'
const username = 'some username'

it('retrieves the github username', async () => {
  fetchMock.get(url, { login: username })
  expect(await retrieveUsername({ accessToken })).toEqual(username)
})
