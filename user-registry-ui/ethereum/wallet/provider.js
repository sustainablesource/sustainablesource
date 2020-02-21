import WalletConnectProvider from '@walletconnect/web3-provider'
import { infuraId } from '../infura'

let provider = null

export const getWeb3Provider = () => {
  if (!provider) {
    provider = new WalletConnectProvider({ infuraId })
    provider.on('close', () => {
      forceNewWeb3Provider()
    })
  }

  return provider
}

export const forceNewWeb3Provider = () => {
  provider = null
}
