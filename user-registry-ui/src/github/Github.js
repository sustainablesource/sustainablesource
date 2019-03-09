import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import { loginUrl } from '@sustainablesource/github-oauth'

export const Github = ({ username }) => {
  if (username) {
    return <GithubUser username={username} />
  } else {
    return <GithubLogin />
  }
}

const GithubUser = ({ username }) => <p>{username}</p>
const GithubLogin = () => (
  <Button
    onClick={() => {
      window.location.assign(loginUrl)
    }}
  >
    login to Github
  </Button>
)
