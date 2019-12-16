import { storeUsername, clearUsername } from './actions'
import { usernameRetriever } from './middleware'
import { retrieveUsername } from '@sustainablesource/github-api'

const accessToken = 'some_token'
const username = 'some name'
const action = { some: 'action' }

let store
let next

beforeEach(() => {
  retrieveUsername.mockResolvedValue(username)
  store = {
    getState: jest.fn(),
    dispatch: jest.fn()
  }
  next = jest.fn()
})

it('calls next', async () => {
  store.getState.mockReturnValue({ github: { oauth: {} } })
  await usernameRetriever(store)(next)(action)
  expect(next).toBeCalledWith(action)
})

describe('when an oauth access token is set', () => {
  beforeEach(async () => {
    store.getState
      .mockReturnValueOnce({ github: { oauth: {} } })
      .mockReturnValueOnce({ github: { oauth: { accessToken } } })
    await usernameRetriever(store)(next)(action)
  })

  it('retrieves the github username', () => {
    expect(retrieveUsername).toBeCalledWith({ accessToken })
  })

  it('updates the username', () => {
    expect(store.dispatch).toBeCalledWith(storeUsername(username))
  })
})

describe('when the oauth token is cleared', () => {
  beforeEach(async () => {
    store.getState
      .mockReturnValueOnce({ github: { oauth: { accessToken } } })
      .mockReturnValueOnce({ github: { oauth: {} } })
    await usernameRetriever(store)(next)(action)
  })

  it('clears the username', () => {
    expect(store.dispatch).toBeCalledWith(clearUsername())
  })

  it('does not retrieve the username', () => {
    expect(retrieveUsername).not.toBeCalled()
  })
})

describe('when the oauth token remains the same', () => {
  beforeEach(async () => {
    store.getState
      .mockReturnValueOnce({ github: { oauth: { accessToken } } })
      .mockReturnValueOnce({ github: { oauth: { accessToken } } })
    await usernameRetriever(store)(next)(action)
  })

  it('does not update the username', () => {
    expect(store.dispatch).not.toBeCalled()
  })

  it('does not retrieve the username', () => {
    expect(retrieveUsername).not.toBeCalled()
  })
})
