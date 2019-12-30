import { createAction } from 'redux-starter-kit'
import WalletConnect from '@walletconnect/browser'

const bridge = 'https://bridge.walletconnect.org'
export const connectToWallet = () => async dispatch => {
  const connector = new WalletConnect({ bridge })
  if (!connector.connected) { await connector.createSession() }
  dispatch(storeWalletUri(connector.uri))
}

export const storeWalletUri = createAction('ethereum/wallet/uri/store')
export const storeAccount = createAction('ethereum/account/store')
