const testNetworks = {
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan'
}

function isTestNetwork (web3) {
  return !!testNetworks[web3.version.network]
}

module.exports.isTestNetwork = isTestNetwork
