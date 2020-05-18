export const mockOracleRequest = jest.fn()
export const mockOracleResponse = jest.fn()

const users = {
  oracleRequest: mockOracleRequest,
  oracleResponse: mockOracleResponse
}

export const Users = {
  deployed: async () => users
}
