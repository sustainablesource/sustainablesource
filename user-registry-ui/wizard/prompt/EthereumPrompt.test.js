import React from 'react'
import { renderWithRedux } from '../../store/testrender'
import { mockUri } from '@walletconnect/browser'
import { getWalletUri } from '../../ethereum'
import { EthereumPrompt } from './EthereumPrompt'

const walletUri = 'some:walletconnect:uri'

it('initiates wallet connection when shown', () => {
  mockUri(walletUri)
  const { store } = renderWithRedux(<EthereumPrompt />)
  expect(getWalletUri(store.getState())).toEqual(walletUri)
})
