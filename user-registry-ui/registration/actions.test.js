import {
  createAttestation,
  removeAttestation,
  storeAttestationId,
  clearAttestationId,
  signalAttestationError
} from './actions'
import { createGist, deleteGist } from '@sustainablesource/github-api'

const accessToken = 'some_token'

let dispatch

beforeEach(() => {
  dispatch = jest.fn()
})

describe('attesting the ethereum account', () => {
  const account = '0xSomeAccount'
  const getState = () => ({
    github: { oauth: { accessToken } },
    ethereum: { account }
  })

  let action

  beforeEach(() => {
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

describe('removing the attestation', () => {
  const id = 'some_gist_id'
  const getState = () => ({
    github: { oauth: { accessToken } },
    registration: { attestationId: id }
  })

  let action

  beforeEach(() => {
    action = removeAttestation()
  })

  it('deletes the github gist', async () => {
    await action(dispatch, getState)
    expect(deleteGist).toBeCalledWith({ accessToken, id })
  })

  it('clears the gist id', async () => {
    await action(dispatch, getState)
    expect(dispatch).toBeCalledWith(clearAttestationId())
  })

  it('handles errors while deleting gist', async () => {
    const error = new Error('some error')
    deleteGist.mockRejectedValue(error)
    await action(dispatch, getState)
    expect(dispatch).toBeCalledWith(signalAttestationError(error.message))
  })
})
