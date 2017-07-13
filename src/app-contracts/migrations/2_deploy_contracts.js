const SustainableSource = artifacts.require('SustainableSource.sol')
const Users = artifacts.require('Users.sol')

module.exports = function (deployer) {
  deployer.deploy(SustainableSource)
  deployer.deploy(Users)
}
