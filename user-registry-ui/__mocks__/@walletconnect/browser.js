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
const mockOn = jest.fn()
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

export const mockEvent = ({ name, error = null, payload = null }) => {
  mockOn.mock.calls
    .filter(([event]) => event === name)
    .forEach(([, callback]) => { callback(error, payload) })
}

export default WalletConnect
