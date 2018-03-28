const Licenses = artifacts.require('Licenses.sol')
const Users = artifacts.require('Users.sol')
const PullRequests = artifacts.require('PullRequests.sol')
const Contributions = artifacts.require('Contributions.sol')
const Payout = artifacts.require('Payout.sol')

async function deploy (deployer) {
  await deployer.deploy(Users)
  await deployer.deploy(PullRequests, 'sustainablesource/sustainablesource')
  await deployer.deploy(Contributions, Users.address, PullRequests.address)
  await deployer.deploy(Payout, Contributions.address)
  await deployer.deploy(Licenses, Payout.address, web3.toWei(250, 'finney'))
}

module.exports = function (deployer) {
  // workaround for https://github.com/trufflesuite/truffle/issues/501:
  deployer.then(() => deploy(deployer))
}
