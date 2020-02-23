import { getEthereumAccount, getError, isConnected } from './selectors'

it('selects the connection state', () => {
  const state = { ethereum: { wallet: { connected: true } } }
  expect(isConnected(state)).toBe(true)
})

it('selects the ethereum account', () => {
  const account = 'some ethereum account'
  const state = { ethereum: { wallet: { account } } }
  expect(getEthereumAccount(state)).toEqual(account)
})

it('selects error', () => {
  const error = 'some error'
  const state = { ethereum: { wallet: { error } } }
  expect(getError(state)).toEqual(error)
})
