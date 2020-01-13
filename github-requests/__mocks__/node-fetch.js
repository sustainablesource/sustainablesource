import fetchMock from 'fetch-mock'
import nodeFetch from 'node-fetch'

const fetch = fetchMock.sandbox()
fetch.config = { ...fetch.config, ...nodeFetch }

beforeEach(() => {
  fetch.reset()
})

export default fetch
