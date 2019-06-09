import React from 'react'
import { Step } from 'semantic-ui-react'

export const Wizard = () => (
  <Step.Group>
    <Step icon='github' title='Github' description='Login to Github' active />
  </Step.Group>
)
