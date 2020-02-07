export const mockEnable = jest.fn()

const mockOn = jest.fn()

export const mockEvent = (name, ...args) => {
  mockOn.mock.calls
    .filter(([event]) => event === name)
    .forEach(([, handler]) => { handler(...args) })
}

const WalletConnectProvider = jest.fn(() => ({
  enable: mockEnable,
  on: mockOn
}))

export default WalletConnectProvider
