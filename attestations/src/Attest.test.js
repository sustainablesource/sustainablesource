import React from 'react'
import { render, getByText } from 'react-testing-library'
import { Attest } from './Attest'

const reason = 'in order to collect your income'

let rendered

beforeEach(() => {
  rendered = render(<Attest reason={reason} />)
})

it('explains why attestation is necessary', () => {
  expect(getByText(rendered.container, reason)).toBeInTheDocument()
})
