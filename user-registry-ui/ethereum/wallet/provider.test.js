import WalletConnectProvider, { mockEvent } from '@walletconnect/web3-provider'
import { infuraId } from '../infura'
import { getWeb3Provider, forceNewWeb3Provider } from './provider'

it('provides the infura id', async () => {
  getWeb3Provider()
  expect(WalletConnectProvider).toBeCalledWith({ infuraId })
})

it('returns the same instance', () => {
  expect(getWeb3Provider()).toBe(getWeb3Provider())
})

it('returns a new instance after closing', () => {
  const old = getWeb3Provider()
  mockEvent('close')
  expect(getWeb3Provider()).not.toBe(old)
})

it('returns a new instance when forced', () => {
  const old = getWeb3Provider()
  forceNewWeb3Provider()
  expect(getWeb3Provider()).not.toBe(old)
})

afterEach(() => {
  forceNewWeb3Provider()
})
