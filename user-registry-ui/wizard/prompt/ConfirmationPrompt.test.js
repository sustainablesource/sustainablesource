import React from 'react'
import { renderWithRedux } from '../../store/testrender'
import { ConfirmationPrompt } from './ConfirmationPrompt'

const username = 'some user name'
const account = '0xSomeAccount'

it('shows github account used for registration', () => {
  const state = { github: { username } }
  const { queryByText } = renderWithRedux(<ConfirmationPrompt />, state)
  expect(queryByText(username, { exact: false })).not.toBeNull()
})

it('shows ethereum account used for registration', () => {
  const state = { ethereum: { wallet: { account } } }
  const { queryByText } = renderWithRedux(<ConfirmationPrompt />, state)
  expect(queryByText(account, { exact: false })).not.toBeNull()
})
