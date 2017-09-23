const Licenses = artifacts.require('Licenses.sol')
const Users = artifacts.require('Users.sol')
const PullRequests = artifacts.require('PullRequests.sol')

module.exports = function (deployer) {
  deployer.deploy(Licenses)
  deployer.deploy(Users)
  deployer.deploy(PullRequests, 'sustainablesource/sustainablesource')
}
