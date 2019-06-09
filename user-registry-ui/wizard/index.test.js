import React from 'react'
import { render } from '@testing-library/react'
import { Wizard } from './index'

it('shows the github step initially', () => {
  const { getByText } = render(<Wizard />)
  expect(surroundingStep(getByText('Github'))).toHaveClass('active')
})

function surroundingStep (element) {
  if (!element) {
    return null
  } else if (element.className.split(' ').includes('step')) {
    return element
  } else {
    return surroundingStep(element.parentElement)
  }
}
