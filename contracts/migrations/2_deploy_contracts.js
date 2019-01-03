const Users = artifacts.require('Users')
const SustainableSource = artifacts.require('SustainableSource')

async function deploy (deployer) {
  const repo = 'sustainablesource/sustainablesource'
  const fee = web3.utils.toWei('250', 'finney')
  await deployer.deploy(Users)
  await deployer.deploy(SustainableSource, Users.address, repo, fee)
}

module.exports = function (deployer) {
  // workaround for https://github.com/trufflesuite/truffle/issues/501:
  deployer.then(() => deploy(deployer))
}
