import Web3 from 'web3'
import WalletConnectProvider, { mockEvent } from '@walletconnect/web3-provider'
import { infuraId } from '../infura'
import { storeAccount, connected, disconnected } from '../wallet'
import { newWeb3Id } from './actions'
import { getWeb3 } from './getWeb3'

describe('web3 getter', () => {
  const account = '0xSomeAccount'

  let web3
  let state
  let dispatch

  beforeEach(() => {
    state = { ethereum: { web3: { id: Math.random() }}}
    dispatch = jest.fn()
    web3 = getWeb3(state, dispatch)
  })

  it('returns a web3 instance', () => {
    expect(web3).toBeInstanceOf(Web3)
  })

  it('remembers the web3 instance', () => {
    expect(getWeb3(state, dispatch)).toBe(web3)
  })

  it('provides the infura id', () => {
    expect(WalletConnectProvider).toBeCalledWith({ infuraId })
  })

  it('stores the main ethereum account when accounts change', () => {
    mockEvent('accountsChanged', [account])
    expect(dispatch).toBeCalledWith(storeAccount(account))
  })

  it('signals when connected', () => {
    mockEvent('open')
    expect(dispatch).toBeCalledWith(connected())
  })

  it('signals when disconnected', () => {
    mockEvent('close', 42, 'some reason')
    expect(dispatch).toBeCalledWith(disconnected())
  })

  it('returns a new web3 instance after closing', () => {
    mockEvent('close', 42, 'some reason')
    expect(dispatch).toBeCalledWith(newWeb3Id())
  })
})
