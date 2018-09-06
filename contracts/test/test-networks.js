const testNetworks = {
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan'
}

async function isTestNetwork (web3) {
  return new Promise(function (resolve, reject) {
    web3.eth.net.getId(function (error, network) {
      if (error) {
        reject(error)
      } else {
        resolve(!!testNetworks[network])
      }
    })
  })
}

module.exports.isTestNetwork = isTestNetwork
