import { Users } from '@sustainablesource/user-registry'

export const attest = ({ username, gistId }) => async () => {
  const users = await Users.deployed()
  const price = await users.attestationPrice.call()
  await users.attest(username, gistId, { value: price })
}
