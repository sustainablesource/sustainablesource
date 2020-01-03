import React from 'react'
import { Button, Container, Divider, List, Segment } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { getGithubUsername } from '../../github'
import { getEthereumAccount } from '../../ethereum'

export const ConfirmationPrompt = () => {
  const username = useSelector(getGithubUsername)
  const account = useSelector(getEthereumAccount)
  return (
    <Container text data-testid='confirmation-prompt'>
      You're about to publicly register your Github username and Ethereum
      account for receiving Sustainable Source payouts. Is this what you want?
      <Divider hidden />
      <List>
        <List.Item icon='github' description={username} />
        <List.Item icon='ethereum' description={account} />
      </List>
      <Divider hidden />
      <Segment basic textAlign='center'>
        <Button primary content='Register' />
      </Segment>
    </Container>
  )
}
