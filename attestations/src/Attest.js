import React from 'react'
import Button from 'react-bootstrap/lib/Button'

export const Attest = ({ reason, username, address }) => (<div>
  <Reason>{ reason }</Reason>
  <GithubUsername username={username} />
  <EthereumAddress address={address} />
  <Button disabled={!username || !address}>register</Button>
</div>)

const Reason = ({ children }) => (<p>{ children }</p>)
const GithubUsername = ({ username }) => (<p>{ username }</p>)
const EthereumAddress = ({ address }) => (<p>{ address }</p>)
