import { getWeb3Id, getEthereumAccount, getError, isConnected }
  from './selectors'

it('selects a the web3 id', () => {
  const id = 'some id'
  const state = { ethereum: { web3: { id } } }
  expect(getWeb3Id(state)).toEqual(id)
})

it('selects the connection state', () => {
  const state = { ethereum: { connected: true } }
  expect(isConnected(state)).toBe(true)
})

it('selects the ethereum account', () => {
  const account = 'some ethereum account'
  const state = { ethereum: { account } }
  expect(getEthereumAccount(state)).toEqual(account)
})

it('selects error', () => {
  const error = 'some error'
  const state = { ethereum: { error } }
  expect(getError(state)).toEqual(error)
})
