import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { infuraId } from '../infura'
import { derivedState } from '../../redux'
import { getWeb3Id } from './selectors'
import { newWeb3Id } from './actions'
import { storeAccount, connected, disconnected } from '../wallet'

const createWeb3 = (_, dispatch) => {
  const provider = new WalletConnectProvider({ infuraId })
  provider.on('accountsChanged', ([account]) => {
    dispatch(storeAccount(account))
  })
  provider.on('open', () => {
    dispatch(connected())
  })
  provider.on('close', () => {
    dispatch(disconnected())
    dispatch(newWeb3Id())
  })
  return new Web3(provider)
}

export const getWeb3 = derivedState(getWeb3Id, createWeb3)
