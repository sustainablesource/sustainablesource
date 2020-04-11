module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!truffle.js',
    '!test/**',
    '!migrations/**',
    '!*.config.js',
    '!**/node_modules/**'
  ],
  coverageReporters: [
    'text-summary'
  ]
}
