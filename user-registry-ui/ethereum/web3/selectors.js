import { createSelector } from '@reduxjs/toolkit'
import Web3 from 'web3'
import { isConnected, getWeb3Provider } from '../wallet'

export const getWeb3 = createSelector(
  isConnected,
  connected => {
    if (connected) {
      return new Web3(getWeb3Provider())
    } else {
      return null
    }
  }
)
