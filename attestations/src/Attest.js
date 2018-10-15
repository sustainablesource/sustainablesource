import React from 'react'

export const Attest = ({ reason, githubUsername }) => (<div>
  <Reason>{ reason }</Reason>
  <GithubUsername username={githubUsername} />
</div>)

const Reason = ({ children }) => (<p>{ children }</p>)
const GithubUsername = ({ username }) => (<p>{ username }</p>)
