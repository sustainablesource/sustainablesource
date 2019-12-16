import { retrieveUsername, storeUsername } from './actions'
import * as api from '@sustainablesource/github-api'

const accessToken = 'some_token'
const username = 'some name'

it('retrieves github username', async () => {
  const action = retrieveUsername({ accessToken })
  const dispatch = jest.fn()
  api.retrieveUsername.mockResolvedValue(username)

  await action(dispatch)

  expect(api.retrieveUsername).toBeCalledWith({ accessToken })
  expect(dispatch).toBeCalledWith(storeUsername(username))
})
