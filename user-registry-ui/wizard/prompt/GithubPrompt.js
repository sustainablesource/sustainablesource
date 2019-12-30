import React from 'react'
import { Button, Container, Segment } from 'semantic-ui-react'
import { loginUrl } from '@sustainablesource/github-oauth'

export const GithubPrompt = () => (
  <Container text data-testid='github-prompt'>
    <Container text>
      You earn income when you contribute to Sustainable Source projects on
      Github. Login with the account that you use for these contributions.
    </Container>
    <Segment basic padded='very' textAlign='center'>
      <Button
        primary
        content='Login to Github'
        onClick={() => {
          window.location.assign(loginUrl)
        }}
      />
    </Segment>
  </Container>
)
