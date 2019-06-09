import { getGithubUsername, getEthereumAccount } from './selectors'

it('selects the github username', () => {
  const username = 'some user name'
  expect(getGithubUsername({ github: { username } })).toEqual(username)
})

it('selects the ethereum account', () => {
  const account = 'some ethereum account'
  expect(getEthereumAccount({ ethereum: { account } })).toEqual(account)
})
