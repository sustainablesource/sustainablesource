const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    ropsten: {
      network_id: 3,
      provider: () =>
        new HDWalletProvider(
          process.env['ETHEREUM_WALLET_MNEMONIC'],
          `https://ropsten.infura.io/v3/${process.env['INFURA_API_KEY']}`
        )
    }
  },
  mocha: {
    slow: 5 * 60 * 1000
  }
}
