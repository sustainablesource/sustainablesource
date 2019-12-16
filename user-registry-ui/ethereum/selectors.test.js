import { getEthereumAccount } from './selectors'

it('selects the ethereum account', () => {
  const account = 'some ethereum account'
  expect(getEthereumAccount({ ethereum: { account } })).toEqual(account)
})
