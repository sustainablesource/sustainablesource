import { createAction } from 'redux-starter-kit'
import { getGithubOAuthToken } from '../github'
import { getEthereumAccount } from '../ethereum'
import { createGist } from '@sustainablesource/github-api'

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

export const storeAttestationId = createAction('registration/attestation/store')
export const signalAttestationError = createAction('registration/attestation/error')
