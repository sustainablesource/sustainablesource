import { getGithubUsername, getGithubOAuthToken } from './selectors'

it('selects the github username', () => {
  const username = 'some user name'
  expect(getGithubUsername({ github: { username } })).toEqual(username)
})

it('selects the oauth token', () => {
  const accessToken = 'some_token'
  const state = { github: { oauth: { accessToken } } }
  expect(getGithubOAuthToken(state)).toEqual(accessToken)
})
