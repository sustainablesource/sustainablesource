import React from 'react'
import { Github } from './github'
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
const EthereumAddress = ({ address }) => <p>{address}</p>
