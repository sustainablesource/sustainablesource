import { registrationReducer as reducer } from './reducer'
import { storeAttestationId, clearAttestationId } from './actions'

const attestationId = 'some_gist_id'

it('stores attestation id', () => {
  const state = reducer({}, storeAttestationId(attestationId))
  expect(state.attestationId).toEqual(attestationId)
})

it('clears attestation id', () => {
  const state = reducer({ attestationId: 'some_id' }, clearAttestationId())
  expect(state.attestationId).toBeNull()
})
