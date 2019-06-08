module.exports = {
  collectCoverage: true,
  coverageReporters: [
    'text-summary'
  ],
  setupFilesAfterEnv: [
    '@testing-library/react/cleanup-after-each'
  ]
}
