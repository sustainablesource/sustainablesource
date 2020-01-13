import { get } from '@sustainablesource/github-requests'
import { retrieveUsername } from './users'

const accessToken = 'some_token'
const username = 'some username'

it('retrieves the github username', async () => {
  get.mockResolvedValue({ login: username })
  expect(await retrieveUsername({ accessToken })).toEqual(username)
  expect(get).toBeCalledWith('/user', accessToken)
})
