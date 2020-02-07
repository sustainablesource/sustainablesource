import { ethereumReducer } from './reducer'
import { storeAccount, connected, disconnected, signalWalletError }
  from './actions'

const account = '0xSomeAccount'

it('stores the ethereum account', () => {
  const state = ethereumReducer({}, storeAccount(account))
  expect(state.account).toEqual(account)
})

it('signals a wallet error', () => {
  const error = 'some error'
  const state = ethereumReducer({}, signalWalletError(error))
  expect(state.error).toEqual(error)
})

it('signals when connected', () => {
  const state = ethereumReducer({}, connected())
  expect(state.connected).toBe(true)
})

it('signals when disconnected', () => {
  const state = ethereumReducer({}, disconnected())
  expect(state.connected).toBe(false)
})

it('clears a previous error when a new connection is established', () => {
  const state = ethereumReducer({ error: 'some error' }, connected())
  expect(state.error).toBeNull()
})

it('clears a previous error when a new account is stored', () => {
  const state = ethereumReducer({ error: 'some error' }, storeAccount(account))
  expect(state.error).toBeNull()
})

it('clears wallet uri and ethereum account when disconnected', () => {
  const state = ethereumReducer({ account }, disconnected())
  expect(state.account).toBeNull()
})
