import React from 'react'
import { Step } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getGithubUsername } from './selectors'

let Wizard = ({ username }) => {
  const step = username ? 2 : 1
  return (
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
        active={step === 2}
        disabled={step < 2}
      />
    </Step.Group>
  )
}

Wizard = connect(state => ({
  username: getGithubUsername(state)
}))(Wizard)

export { Wizard }
