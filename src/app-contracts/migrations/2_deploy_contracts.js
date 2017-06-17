const SustainableSource = artifacts.require('SustainableSource.sol')
const GitHub = artifacts.require('GitHub.sol')

module.exports = function (deployer) {
  deployer.deploy(SustainableSource)
  deployer.deploy(GitHub)
}
