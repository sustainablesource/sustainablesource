import { createAction } from 'redux-starter-kit'
import WalletConnect from '@walletconnect/browser'

const bridge = 'https://bridge.walletconnect.org'

export const storeWalletUri = createAction('ethereum/wallet/uri/store')
export const storeAccount = createAction('ethereum/account/store')
export const signalWalletError = createAction('ethereum/wallet/error')

export const connectToWallet = () => async dispatch => {
  const connector = new WalletConnect({ bridge })
  await createWalletSession(connector, dispatch)
  handleWalletEvents(connector, dispatch)
}

const createWalletSession = async (connector, dispatch) => {
  if (!connector.connected) {
    await connector.createSession()
  } else {
    dispatch(storeAccount(connector.accounts[0]))
  }
  dispatch(storeWalletUri(connector.uri))
}

const handleWalletEvents = (connector, dispatch) => {
  connector.on('connect', handleWalletUpdate(dispatch))
  connector.on('session_update', handleWalletUpdate(dispatch))
}

const handleWalletUpdate = dispatch => (error, payload) => {
  if (!error) {
    dispatch(storeAccount(payload.params[0].accounts[0]))
  } else {
    dispatch(signalWalletError(error))
  }
}
