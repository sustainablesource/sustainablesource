const Ganache = require('ganache-core')

module.exports = {
  networks: {
    testing: {
      network_id: '*',
      provider: Ganache.provider()
    }
  },
  mocha: {
    slow: 2000
  }
}
