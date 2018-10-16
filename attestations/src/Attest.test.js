import React from 'react'
import { render } from 'react-testing-library'
import { Attest } from './Attest'

const reason = 'in order to collect your income'
const username = 'some_user'
const address = '0x1234567890'

it('explains why attestation is necessary', () => {
  const { getByText } = render(<Attest reason={reason} />)
  expect(getByText(reason)).toBeInTheDocument()
})

it('shows github username when provided', () => {
  const { getByText } = render(<Attest username={username} />)
  expect(getByText(username)).toBeInTheDocument()
})

it('shows github login when username not provided', () => {
  const { getByText } = render(<Attest />)
  expect(getByText('login to Github')).toBeInTheDocument()
})

it('shows ethereum address when provided', () => {
  const { getByText } = render(<Attest address={address} />)
  expect(getByText(address)).toBeInTheDocument()
})

it('enables the register button when username and address are known', () => {
  const { getByText } = render(<Attest username={username} address={address} />)
  expect(getByText('register')).not.toBeDisabled()
})

it('disables the register button when username is unknown', () => {
  const { getByText } = render(<Attest address={address} />)
  expect(getByText('register')).toBeDisabled()
})

it('disables the register button when address is unknown', () => {
  const { getByText } = render(<Attest username={username} />)
  expect(getByText('register')).toBeDisabled()
})
