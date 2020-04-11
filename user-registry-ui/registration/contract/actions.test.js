import { mockAttest, mockAttestationPrice }
  from '@sustainablesource/user-registry'
import { attest } from './actions'

it('registers on ethereum', async () => {
  const username = 'some username'
  const gistId = 'some gist id'
  const price = 42

  mockAttestationPrice.mockResolvedValue(price)

  const action = attest({ username, gistId })
  await action()

  expect(mockAttest).toBeCalledWith(username, gistId, { value: price })
})
