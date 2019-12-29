import React from 'react'
import { renderWithRedux } from '../../store/testrender'
import { mockUri } from '@walletconnect/browser'
import { getWalletUri } from '../../ethereum'
import { EthereumPrompt } from './EthereumPrompt'

const wallletUri = 'some:walletconnect:uri'

it('initiates wallet connection when shown', () => {
  mockUri(wallletUri)
  const { store } = renderWithRedux(<EthereumPrompt />)
  expect(getWalletUri(store.getState())).toEqual(wallletUri)
})
