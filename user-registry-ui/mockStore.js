import configureMockStore from 'redux-mock-store'
const createMockStore = configureMockStore()

export function mockStore ({ github = {}, ethereum = {} } = {}) {
  return createMockStore({ github, ethereum })
}
