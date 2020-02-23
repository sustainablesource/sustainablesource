import React from 'react'
import { renderWithRedux } from '../store/testrender'
import { Wizard } from './index'

describe('initially', () => {
  it('shows the github step', () => {
    const { getByText } = renderWithRedux(<Wizard />)
    expect(step(getByText('Github'))).toHaveClass('active')
    expect(step(getByText('Ethereum'))).toHaveClass('disabled')
    expect(step(getByText('Confirm'))).toHaveClass('disabled')
  })

  it('shows the github login prompt', () => {
    const { queryByTestId } = renderWithRedux(<Wizard />)
    expect(queryByTestId('github-prompt')).toBeInTheDocument()
    expect(queryByTestId('ethereum-prompt')).not.toBeInTheDocument()
    expect(queryByTestId('confirmation-prompt')).not.toBeInTheDocument()
  })
})

describe('when the github username is known', () => {
  const state = { github: { username: 'some username' } }

  it('shows the ethereum step', () => {
    const { getByText } = renderWithRedux(<Wizard />, state)
    expect(step(getByText('Github'))).toHaveClass('completed')
    expect(step(getByText('Ethereum'))).toHaveClass('active')
    expect(step(getByText('Confirm'))).toHaveClass('disabled')
  })

  it('shows the ethereum prompt', () => {
    const { queryByTestId } = renderWithRedux(<Wizard />, state)
    expect(queryByTestId('github-prompt')).not.toBeInTheDocument()
    expect(queryByTestId('ethereum-prompt')).toBeInTheDocument()
    expect(queryByTestId('confirmation-prompt')).not.toBeInTheDocument()
  })
})

describe('when the github username and ethereum account are known', () => {
  const state = {
    github: { username: 'some username' },
    ethereum: { wallet: { account: 'some account' } }
  }

  it('shows the confirmation step', () => {
    const { getByText } = renderWithRedux(<Wizard />, state)
    expect(step(getByText('Github'))).toHaveClass('completed')
    expect(step(getByText('Ethereum'))).toHaveClass('completed')
    expect(step(getByText('Confirm'))).toHaveClass('active')
  })

  it('shows the confirmation prompt', () => {
    const { queryByTestId } = renderWithRedux(<Wizard />, state)
    expect(queryByTestId('github-prompt')).not.toBeInTheDocument()
    expect(queryByTestId('ethereum-prompt')).not.toBeInTheDocument()
    expect(queryByTestId('confirmation-prompt')).toBeInTheDocument()
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
