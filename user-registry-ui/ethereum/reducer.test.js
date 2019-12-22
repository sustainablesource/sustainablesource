import { ethereumReducer } from './reducer'
import { storeWalletUri } from './actions'

const uri = 'some:wallet:uri'

it('stores the wallet uri', () => {
  const state = ethereumReducer({}, storeWalletUri(uri))
  expect(state.wallet).toEqual(uri)
})
