import { createAction } from 'redux-starter-kit'
import WalletConnect from '@walletconnect/browser'

const bridge = 'https://bridge.walletconnect.org'
export const connectToWallet = () => dispatch => {
  const connector = new WalletConnect({ bridge })
  if (!connector.connected) { connector.createSession() }
  dispatch(storeWalletUri(connector.uri))
}

export const storeWalletUri = createAction('ethereum/wallet/uri/store')
