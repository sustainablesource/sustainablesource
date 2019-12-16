import React from 'react'
import { Step } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getGithubUsername } from '../github'
import { getEthereumAccount } from '../ethereum'
import { GithubPrompt, EthereumPrompt, ConfirmationPrompt } from './prompt'

let Wizard = ({ username, account }) => {
  const step = username ? account ? 3 : 2 : 1
  return (
    <>
      <Step.Group>
        <Step
          icon='github'
          title='Github'
          description='Login to Github'
          active={step === 1}
          completed={step > 1}
        />
        <Step
          icon='ethereum'
          title='Ethereum'
          description='Select your Identity'
          disabled={step < 2}
          active={step === 2}
          completed={step > 2}
        />
        <Step
          icon='user'
          title='Confirm'
          description='Register for payouts'
          active={step === 3}
          disabled={step < 3}
        />
      </Step.Group>
      { step === 1 && <GithubPrompt /> }
      { step === 2 && <EthereumPrompt /> }
      { step === 3 && <ConfirmationPrompt /> }
    </>
  )
}

Wizard = connect(state => ({
  username: getGithubUsername(state),
  account: getEthereumAccount(state)
}))(Wizard)

export { Wizard }
