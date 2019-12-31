let uri
let connected
let accounts
let chainId

beforeEach(() => {
  uri = null
  connected = false
  accounts = null
  chainId = null
})

export const mockCreateSession = jest.fn()
export const mockOn = jest.fn()
export const mockUri = value => { uri = value }
export const mockConnected = value => { connected = value }
export const mockAccounts = value => { accounts = value }
export const mockChainId = value => { chainId = value }

const WalletConnect = jest.fn(() => ({
  createSession: mockCreateSession,
  on: mockOn,
  uri,
  connected,
  accounts,
  chainId
}))

export default WalletConnect
