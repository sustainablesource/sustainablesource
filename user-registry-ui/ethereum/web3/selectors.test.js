import Web3 from 'web3'
import { getWeb3 } from './selectors'

it('selects a web3 instance', () => {
  const state = { ethereum: { connected: true } }
  expect(getWeb3(state)).toBeInstanceOf(Web3)
})

it('selects the same web3 instance', () => {
  const state = { ethereum: { connected: true } }
  expect(getWeb3(state)).toBe(getWeb3(state))
})

it('selects null when not connected', () => {
  const state = { ethereum: { connected: false } }
  expect(getWeb3(state)).toBeNull()
})
