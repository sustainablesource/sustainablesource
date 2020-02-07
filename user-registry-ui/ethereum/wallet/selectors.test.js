import { getEthereumAccount, getWalletUri, getError } from './selectors'

it('selects the wallet uri', () => {
  const uri = 'some:wallet:uri'
  expect(getWalletUri({ ethereum: { wallet: uri } })).toEqual(uri)
})

it('selects the ethereum account', () => {
  const account = 'some ethereum account'
  expect(getEthereumAccount({ ethereum: { account } })).toEqual(account)
})

it('selects error', () => {
  const error = 'some error'
  expect(getError({ ethereum: { error } })).toEqual(error)
})