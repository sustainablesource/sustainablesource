import React from 'react'

export const Attest = ({ reason, username, address }) => (<div>
  <Reason>{ reason }</Reason>
  <GithubUsername username={username} />
  <EthereumAddress address={address} />
</div>)

const Reason = ({ children }) => (<p>{ children }</p>)
const GithubUsername = ({ username }) => (<p>{ username }</p>)
const EthereumAddress = ({ address }) => (<p>{ address }</p>)
