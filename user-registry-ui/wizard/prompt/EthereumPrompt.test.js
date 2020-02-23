import React from 'react'
import { renderWithRedux } from '../../store/testrender'
import { mockEnable } from '@walletconnect/web3-provider'
import { EthereumPrompt } from './EthereumPrompt'

it('enables the Ethereum provider when connecting to wallet', async () => {
  const { getByText } = renderWithRedux(<EthereumPrompt />)
  getByText('Connect to Wallet').click()
  expect(mockEnable).toBeCalled()
})

it('displays errors', () => {
  const state = { ethereum: { wallet: { error: 'some error' } } }
  const { queryByText } = renderWithRedux(<EthereumPrompt />, state)
  expect(queryByText('some error')).toBeVisible()
})
