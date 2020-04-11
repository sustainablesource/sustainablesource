export const mockAttestationPrice = jest.fn()
export const mockAttest = jest.fn()

const users = {
  attestationPrice: { call: mockAttestationPrice },
  attest: mockAttest
}

export const Users = {
  deployed: async () => users
}
