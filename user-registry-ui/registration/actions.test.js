import { createAttestation, storeAttestationId, signalAttestationError }
  from './actions'
import { createGist } from '@sustainablesource/github-api'

describe('attesting the ethereum account', () => {
  const accessToken = 'some_token'
  const account = '0xSomeAccount'
  const getState = () => ({
    github: { oauth: { accessToken } },
    ethereum: { account }
  })

  let dispatch
  let action

  beforeEach(() => {
    dispatch = jest.fn()
    action = createAttestation()
  })

  it('creates a github gist containing the account', async () => {
    await action(dispatch, getState)
    expect(createGist).toBeCalledWith({
      accessToken,
      options: {
        description: 'Sustainable Source registration',
        files: { attestation: account }
      }
    })
  })

  it('remembers the gist id', async () => {
    const gistId = 'some_gist_id'
    createGist.mockResolvedValue(gistId)
    await action(dispatch, getState)
    expect(dispatch).toBeCalledWith(storeAttestationId(gistId))
  })

  it('handles errors while creating the gist', async () => {
    const error = new Error('some error')
    createGist.mockRejectedValue(error)
    await action(dispatch, getState)
    expect(dispatch).toBeCalledWith(signalAttestationError(error.message))
  })
})
