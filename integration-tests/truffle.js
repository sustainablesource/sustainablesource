const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    kovan: {
      network_id: 42,
      provider: () => new HDWalletProvider(
        process.env['ETHEREUM_WALLET_MNEMONIC'],
        `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
      )
    }
  },
  mocha: {
    slow: 5 * 60 * 1000
  },
  compilers: {
    solc: {
      settings: {
        optimizer: {
          enabled: true
        }
      }
    }
  }
}
