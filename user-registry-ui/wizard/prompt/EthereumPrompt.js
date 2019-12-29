import React, { useEffect } from 'react'
import QRCode from 'qrcode.react'
import { useDispatch, useSelector } from 'react-redux'
import { connectToWallet, getWalletUri } from '../../ethereum'

export const EthereumPrompt = () => {
  const dispatch = useDispatch()
  useEffect(() => dispatch(connectToWallet()), [])
  return (
    <div data-testid='ethereum-prompt'>
      <QRCode data-testid='qrcode' value={useSelector(getWalletUri)} />
    </div>
  )
}
