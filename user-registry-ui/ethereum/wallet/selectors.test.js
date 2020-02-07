import { getEthereumAccount, getError, isConnected } from './selectors'

it('selects the connection state', () => {
  expect(isConnected({ ethereum: { connected: true } })).toBe(true)
})

it('selects the ethereum account', () => {
  const account = 'some ethereum account'
  expect(getEthereumAccount({ ethereum: { account } })).toEqual(account)
})

it('selects error', () => {
  const error = 'some error'
  expect(getError({ ethereum: { error } })).toEqual(error)
})
