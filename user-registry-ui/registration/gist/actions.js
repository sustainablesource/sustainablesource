import { createAction } from 'redux-starter-kit'
import { getGithubOAuthToken } from '../../github'
import { getEthereumAccount } from '../../ethereum'
import { createGist, deleteGist } from '@sustainablesource/github-api'
import { getAttestationId } from './selectors'

export const createAttestation = () => async (dispatch, getState) => {
  const accessToken = getGithubOAuthToken(getState())
  const account = getEthereumAccount(getState())
  try {
    const id = await createGist({
      accessToken,
      options: {
        description: 'Sustainable Source registration',
        files: { attestation: account }
      }
    })
    dispatch(storeAttestationId(id))
  } catch (error) {
    dispatch(signalAttestationError(error.message))
  }
}

export const removeAttestation = () => async (dispatch, getState) => {
  const accessToken = getGithubOAuthToken(getState())
  const id = getAttestationId(getState())
  try {
    await deleteGist({ accessToken, id })
    dispatch(clearAttestationId())
  } catch (error) {
    dispatch(signalAttestationError(error.message))
  }
}

export const storeAttestationId = createAction('registration/attestation/store')
export const clearAttestationId = createAction('registration/attestation/clear')
export const signalAttestationError = createAction('registration/attestation/error')
