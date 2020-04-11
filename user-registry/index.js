import contract from '@truffle/contract'
import usersJson from './build/contracts/Users'

export const Users = contract(usersJson)
