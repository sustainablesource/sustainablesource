import React from 'react'
import Button from 'react-bootstrap/lib/Button'

export const Attest = ({ reason, username, address }) => (
  <div>
    <Reason>{reason}</Reason>
    <Github username={username} />
    <EthereumAddress address={address} />
    <Button disabled={!username || !address}>register</Button>
  </div>
)

const Reason = ({ children }) => <p>{children}</p>
const Github = ({ username }) => {
  if (username) {
    return <GithubUsername username={username} />
  } else {
    return <GithubLogin />
  }
}
const GithubUsername = ({ username }) => <p>{username}</p>
const GithubLogin = () => <Button>login to Github</Button>
const EthereumAddress = ({ address }) => <p>{address}</p>
