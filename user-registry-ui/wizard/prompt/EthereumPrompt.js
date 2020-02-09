import React from 'react'
import { Button, Container, Message, Segment } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { connectToWallet, getError } from '../../ethereum'

export const EthereumPrompt = () => {
  const dispatch = useDispatch()
  return (
    <Container data-testid='ethereum-prompt'>
      <Container text>
        Income from Sustainable Source projects is paid out through the Ethereum
        network. Download a
        <a href='https://walletconnect.org/apps'> WalletConnect </a> compatible
        Ethereum wallet to claim your income.
      </Container>
      <Segment basic padded='very' textAlign='center'>
        <Button
          primary
          content='Connect to Wallet'
          onClick={() => dispatch(connectToWallet())}
        />
      </Segment>
      <ErrorMessage />
    </Container>
  )
}

export const ErrorMessage = () => {
  const error = useSelector(getError)
  if (!error) { return null }
  return (
    <Segment basic padded='very'>
      <Message negative>{error}</Message>
    </Segment>
  )
}
