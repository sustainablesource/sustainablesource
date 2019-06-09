import {getGithubUsername} from './selectors'

it('selects the github username', () => {
  const username = 'some user name'
  expect(getGithubUsername({ github: { username } })).toEqual(username)
})
