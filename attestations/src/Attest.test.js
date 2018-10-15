import React from 'react'
import { render } from 'react-testing-library'
import { Attest } from './Attest'

const reason = 'in order to collect your income'
const githubUsername = 'some_user'
const ethereumAddress = '0x1234567890'

it('explains why attestation is necessary', () => {
  const { getByText } = render(<Attest reason={reason} />)
  expect(getByText(reason)).toBeInTheDocument()
})

it('shows github username when provided', () => {
  const { getByText } = render(<Attest githubUsername={githubUsername} />)
  expect(getByText(githubUsername)).toBeInTheDocument()
})

it('shows ethereum address when provided', () => {
  const { getByText } = render(<Attest ethereumAddress={ethereumAddress} />)
  expect(getByText(ethereumAddress)).toBeInTheDocument()
})
