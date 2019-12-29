import React, { useEffect } from 'react'
import { Container, Divider, Loader } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import { useDispatch, useSelector } from 'react-redux'
import { connectToWallet, getWalletUri } from '../../ethereum'

export const EthereumPrompt = () => {
  const dispatch = useDispatch()
  useEffect(() => dispatch(connectToWallet()), [])
  return (
    <Container text data-testid='ethereum-prompt'>
      <p>
        Income from Sustainable Source projects is paid out through the Ethereum
        network. You'll need to connect an Ethereum wallet to claim your income.
      </p>
      <Divider hidden />
      <WalletQRCode />
    </Container>
  )
}

export const WalletQRCode = () => {
  const walletUri = useSelector(getWalletUri)
  if (walletUri) {
    return <QRCode data-testid='qrcode' value={walletUri} />
  } else {
    return <Loader data-testid='loader' active />
  }
}
