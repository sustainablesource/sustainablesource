import React from 'react'
import { renderWithRedux } from '../../store/testrender'
import { mockUri } from '@walletconnect/browser'
import { getWalletUri } from '../../ethereum'
import { EthereumPrompt } from './EthereumPrompt'

const walletUri = 'some:walletconnect:uri'

beforeEach(() => {
  mockUri(walletUri)
})

it('initiates wallet connection when shown', () => {
  const { store } = renderWithRedux(<EthereumPrompt />)
  expect(getWalletUri(store.getState())).toEqual(walletUri)
})

it('shows a wallet connect qr code', async () => {
  const { getByTestId } = renderWithRedux(<EthereumPrompt />)
  expect(getByTestId('qrcode').getAttribute('value')).toEqual(walletUri)
})
