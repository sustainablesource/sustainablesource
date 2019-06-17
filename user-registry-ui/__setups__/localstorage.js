import 'jest-localstorage-mock'

afterEach(() => {
  window.localStorage.clear()
  window.localStorage.setItem.mockClear()
})
