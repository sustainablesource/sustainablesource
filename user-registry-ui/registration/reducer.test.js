import { registrationReducer } from './reducer'
import { storeAttestationId } from './actions'

const attestationId = 'some_gist_id'

it('stores attestation id', () => {
  const state = registrationReducer({}, storeAttestationId(attestationId))
  expect(state.attestationId).toEqual(attestationId)
})
