import React from 'react'
import { render } from '@testing-library/react'
import { Wizard } from './index'

import { mockStore } from '../store/mockStore'

describe('initially', () => {
  let store

  beforeEach(() => {
    store = mockStore()
  })

  it('shows the github step', () => {
    const { getByText } = render(<Wizard store={store} />)
    expect(step(getByText('Github'))).toHaveClass('active')
    expect(step(getByText('Ethereum'))).toHaveClass('disabled')
    expect(step(getByText('Confirm'))).toHaveClass('disabled')
  })
})

describe('when the github username is known', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      github: { username: 'some username' }
    })
  })

  it('shows the ethereum step', () => {
    const { getByText } = render(<Wizard store={store} />)
    expect(step(getByText('Github'))).toHaveClass('completed')
    expect(step(getByText('Ethereum'))).toHaveClass('active')
    expect(step(getByText('Confirm'))).toHaveClass('disabled')
  })
})

describe('when the github username and ethereum account are known', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      github: { username: 'some username' },
      ethereum: { account: 'some account' }
    })
  })

  it('shows the confirmation step', () => {
    const { getByText } = render(<Wizard store={store} />)
    expect(step(getByText('Github'))).toHaveClass('completed')
    expect(step(getByText('Ethereum'))).toHaveClass('completed')
    expect(step(getByText('Confirm'))).toHaveClass('active')
  })
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
