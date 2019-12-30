import React, { useEffect } from 'react'
import { Container, Loader, Segment } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import { useDispatch, useSelector } from 'react-redux'
import { connectToWallet, getWalletUri } from '../../ethereum'

export const EthereumPrompt = () => {
  const dispatch = useDispatch()
  useEffect(() => { dispatch(connectToWallet()) }, [])
  return (
    <Container data-testid='ethereum-prompt'>
      <Container text>
        Income from Sustainable Source projects is paid out through the Ethereum
        network. You need an Ethereum wallet to claim your income.
      </Container>
      <Segment basic padded='very' textAlign='center'>
        <WalletQRCode />
      </Segment>
      <Container text textAlign='center'>
        Download a <a href='https://walletconnect.org/apps'>WalletConnect </a>
        compatible wallet and use it to scan the QR code.
      </Container>
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
