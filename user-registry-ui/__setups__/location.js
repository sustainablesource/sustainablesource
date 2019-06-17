const location = window.location

let rememberedLocation

beforeEach(() => {
  rememberedLocation = location.href
  location.assign = jest.fn()
})

afterEach(() => {
  location.assign.mockRestore()
  location.href = rememberedLocation
})
