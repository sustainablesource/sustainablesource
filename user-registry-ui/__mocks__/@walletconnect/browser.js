var uri
var connected

beforeEach(() => {
  uri = null
  connected = false
})

export const mockCreateSession = jest.fn()
export const mockOn = jest.fn()
export const mockUri = value => { uri = value }
export const mockConnected = value => { connected = value }

const WalletConnect = jest.fn(() => ({
  createSession: mockCreateSession,
  on: mockOn,
  uri,
  connected
}))

export default WalletConnect
