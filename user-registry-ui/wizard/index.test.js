import React from 'react'
import { render } from '@testing-library/react'
import { Wizard } from './index'

import configureMockStore from 'redux-mock-store'
const mockStore = configureMockStore()

it('shows the github step initially', () => {
  const store = mockStore({ github: {} })
  const { getByText } = render(<Wizard store={store} />)
  expect(step(getByText('Github'))).toHaveClass('active')
  expect(step(getByText('Ethereum'))).toHaveClass('disabled')
})

it('shows the ethereum step when the github username is known', () => {
  const store = mockStore({ github: { username: 'some username' } })
  const { getByText } = render(<Wizard store={store} />)
  expect(step(getByText('Github'))).toHaveClass('completed')
  expect(step(getByText('Ethereum'))).toHaveClass('active')
})

function step (element) {
  if (!element) {
    return null
  } else if (element.className.split(' ').includes('step')) {
    return element
  } else {
    return step(element.parentElement)
  }
}
