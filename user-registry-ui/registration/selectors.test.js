import { getAttestationId } from './selectors'

it('returns the attestation id', () => {
  const id = 'some_gist_id'
  expect(getAttestationId({ registration: { attestationId: id } })).toEqual(id)
})
