import React from 'react'
import { Button, Container, Divider } from 'semantic-ui-react'
import { loginUrl } from '@sustainablesource/github-oauth'

export const GithubPrompt = () => (
  <Container text data-testid='github-prompt'>
    <p>
      You earn income when you contribute to Sustainable Source projects on
      Github. <br />
      Login with the account that you use for these contributions.
    </p>
    <Divider hidden />
    <Button
      primary
      content='Login to Github'
      onClick={() => {
        window.location.assign(loginUrl)
      }}
    />
  </Container>
)
