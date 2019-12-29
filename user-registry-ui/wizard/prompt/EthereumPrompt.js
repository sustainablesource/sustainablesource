import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectToWallet } from '../../ethereum'

export const EthereumPrompt = () => {
  const dispatch = useDispatch()
  useEffect(() => dispatch(connectToWallet()), [])
  return <div data-testid='ethereum-prompt' />
}
