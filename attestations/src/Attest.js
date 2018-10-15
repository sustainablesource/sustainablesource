import React from 'react'

export const Attest = ({ reason, githubUsername, ethereumAddress }) => (<div>
  <Reason>{ reason }</Reason>
  <GithubUsername username={githubUsername} />
  <EthereumAddress address={ethereumAddress} />
</div>)

const Reason = ({ children }) => (<p>{ children }</p>)
const GithubUsername = ({ username }) => (<p>{ username }</p>)
const EthereumAddress = ({ address }) => (<p>{ address }</p>)
