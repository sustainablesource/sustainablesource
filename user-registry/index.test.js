import { Users } from './index'

it('exposes a truffle wrapped Users contract to javascript', () => {
  expect(Users).toBeDefined()
  expect(Users.deployed).toBeDefined()
})
