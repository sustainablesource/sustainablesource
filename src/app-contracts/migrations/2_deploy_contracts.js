const Licenses = artifacts.require('Licenses.sol')
const Users = artifacts.require('Users.sol')
const PullRequests = artifacts.require('PullRequests.sol')
const Payout = artifacts.require('Payout.sol')

module.exports = function (deployer) {
  deployer.deploy(Licenses)
  deployer.deploy(Users)
  deployer.deploy(PullRequests, 'sustainablesource/sustainablesource')
  deployer.deploy(Payout)
}
