module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!*.config.js',
    '!**/node_modules/**'
  ],
  coverageReporters: [
    'text-summary'
  ]
}
