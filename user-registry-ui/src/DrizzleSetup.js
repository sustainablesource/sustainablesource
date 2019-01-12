import React from 'react'
import App from './App'
import { Drizzle, generateStore } from 'drizzle'
import { DrizzleContext } from 'drizzle-react'
import { Users } from '@sustainablesource/contracts'

const options = { contracts: [Users] }
const store = generateStore(options)
const drizzle = new Drizzle(options, store)

export const DrizzleSetup = () => (
  <DrizzleContext.Provider drizzle={drizzle}>
    <App />
  </DrizzleContext.Provider>
)
