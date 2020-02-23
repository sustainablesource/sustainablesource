import { walletReducer } from './reducer'
import { storeAccount, connected, disconnected, signalWalletError }
  from './actions'

const account = '0xSomeAccount'

it('stores the ethereum account', () => {
  const state = walletReducer({}, storeAccount(account))
  expect(state.account).toEqual(account)
})

it('signals a wallet error', () => {
  const error = 'some error'
  const state = walletReducer({}, signalWalletError(error))
  expect(state.error).toEqual(error)
})

it('signals when connected', () => {
  const state = walletReducer({}, connected())
  expect(state.connected).toBe(true)
})

it('signals when disconnected', () => {
  const state = walletReducer({}, disconnected())
  expect(state.connected).toBe(false)
})

it('clears a previous error when a new connection is established', () => {
  const state = walletReducer({ error: 'some error' }, connected())
  expect(state.error).toBeNull()
})

it('clears a previous error when a new account is stored', () => {
  const state = walletReducer({ error: 'some error' }, storeAccount(account))
  expect(state.error).toBeNull()
})

it('clears wallet uri and ethereum account when disconnected', () => {
  const state = walletReducer({ account }, disconnected())
  expect(state.account).toBeNull()
})
