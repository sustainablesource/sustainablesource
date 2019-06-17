module.exports = {
  collectCoverage: true,
  coverageReporters: [
    'text-summary'
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: [
    '@testing-library/react/cleanup-after-each',
    'jest-dom/extend-expect',
    './__setups__/localstorage',
    './__setups__/location'
  ]
}
