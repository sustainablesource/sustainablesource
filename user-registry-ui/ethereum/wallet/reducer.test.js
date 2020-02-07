import { ethereumReducer } from './reducer'
import { storeWalletUri, storeAccount, disconnected, signalWalletError }
  from './actions'

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

it('signals a wallet error', () => {
  const error = 'some error'
  const state = ethereumReducer({}, signalWalletError(error))
  expect(state.error).toEqual(error)
})

it('clears a previous error when a new wallet uri is stored', () => {
  const state = ethereumReducer({ error: 'some error' }, storeWalletUri(uri))
  expect(state.error).toBeNull()
})

it('clears a previous error when a new account is stored', () => {
  const state = ethereumReducer({ error: 'some error' }, storeAccount(account))
  expect(state.error).toBeNull()
})

it('clears wallet uri and ethereum account when disconnected', () => {
  const state = ethereumReducer({ wallet: uri, account }, disconnected())
  expect(state.wallet).toBeNull()
  expect(state.account).toBeNull()
})
