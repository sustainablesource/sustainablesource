const SustainableSource = artifacts.require('SustainableSource.sol')

module.exports = function (deployer) {
  deployer.deploy(SustainableSource)
}
