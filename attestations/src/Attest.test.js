import React from 'react'
import { render } from 'react-testing-library'
import { Attest } from './Attest'

const reason = 'in order to collect your income'
const githubUsername = 'some_user'

it('explains why attestation is necessary', () => {
  const { getByText } = render(<Attest reason={reason} />)
  expect(getByText(reason)).toBeInTheDocument()
})

it('shows github username when provided', () => {
  const { getByText } = render(<Attest githubUsername={githubUsername} />)
  expect(getByText(githubUsername)).toBeInTheDocument()
})
