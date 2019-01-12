import React from 'react'
import Button from 'react-bootstrap/lib/Button'

export const Github = ({ username }) => {
  if (username) {
    return <GithubUser username={username} />
  } else {
    return <GithubLogin />
  }
}

const GithubUser = ({ username }) => <p>{username}</p>
const GithubLogin = () => <Button>login to Github</Button>
