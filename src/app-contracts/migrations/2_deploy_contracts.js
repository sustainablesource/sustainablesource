const SustainableSource = artifacts.require('SustainableSource.sol')
const Users = artifacts.require('Users.sol')
const PullRequests = artifacts.require('PullRequests.sol')

module.exports = function (deployer) {
  deployer.deploy(SustainableSource)
  deployer.deploy(Users)
  deployer.deploy(PullRequests, 'sustainablesource/sustainablesource')
}
