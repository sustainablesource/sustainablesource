import React from 'react'
import { renderWithRedux } from '../../store/testrender'
import { wait } from '@testing-library/react'
import { mockUri } from '@walletconnect/browser'
import { getWalletUri } from '../../ethereum'
import { EthereumPrompt } from './EthereumPrompt'

const walletUri = 'some:walletconnect:uri'

it('initiates wallet connection when shown', async () => {
  mockUri(walletUri)
  const { store } = renderWithRedux(<EthereumPrompt />)
  await wait(() => {
    expect(getWalletUri(store.getState())).toEqual(walletUri)
  })
})

it('shows a wallet connect qr code', async () => {
  mockUri(walletUri)
  const { getByTestId } = renderWithRedux(<EthereumPrompt />)
  await wait(() => {
    expect(getByTestId('qrcode').getAttribute('value')).toEqual(walletUri)
  })
})

it('shows a spinner when wallet connection is not yet established', () => {
  const { queryByTestId } = renderWithRedux(<EthereumPrompt />)
  expect(queryByTestId('loader')).toBeVisible()
})
