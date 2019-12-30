import { ethereumReducer } from './reducer'
import { storeWalletUri, storeAccount } from './actions'

const uri = 'some:wallet:uri'
const account = '0xSomeAccount'

it('stores the wallet uri', () => {
  const state = ethereumReducer({}, storeWalletUri(uri))
  expect(state.wallet).toEqual(uri)
})

it('stores the ethereum account', () => {
  const state = ethereumReducer({}, storeAccount(account))
  expect(state.account).toEqual(account)
})
