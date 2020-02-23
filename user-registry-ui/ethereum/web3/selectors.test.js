import { getWeb3Id } from './selectors'

it('selects a the web3 id', () => {
  const id = 'some id'
  const state = { ethereum: { web3: { id } } }
  expect(getWeb3Id(state)).toEqual(id)
})
