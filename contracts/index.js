const contract = require('truffle-contract')

const contractNames = []

const contracts = {}
contractNames.forEach(function (name) {
  const json = require(`./build/contracts/${name}.json`)
  contracts[name] = contract(json)
})

function setProvider (web3Provider) {
  for (const name in contracts) {
    contracts[name].setProvider(web3Provider)
  }
}

function setTransactionDefaults (defaults) {
  for (const name in contracts) {
    contracts[name].defaults(defaults)
  }
}

module.exports = Object.assign({}, contracts, {
  setTransactionDefaults: setTransactionDefaults,
  setProvider: setProvider
})
