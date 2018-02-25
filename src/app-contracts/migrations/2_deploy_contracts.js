const Licenses = artifacts.require('Licenses.sol')
const Users = artifacts.require('Users.sol')
const PullRequests = artifacts.require('PullRequests.sol')
const Contributions = artifacts.require('Contributions.sol')

async function deploy (deployer) {
  await deployer.deploy(Licenses)
  await deployer.deploy(Users)
  await deployer.deploy(PullRequests, 'sustainablesource/sustainablesource')
  await deployer.deploy(Contributions, Users.address, PullRequests.address)
}

module.exports = function (deployer) {
  // workaround for https://github.com/trufflesuite/truffle/issues/501:
  deployer.then(() => deploy(deployer))
}
