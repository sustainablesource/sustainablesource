const Users = artifacts.require('Users')
const SustainableSource = artifacts.require('SustainableSource')

const repo = 'sustainablesource/sustainablesource'
const licenseFee = web3.utils.toWei('0.25', 'ether')
const attestationFee = web3.utils.toWei('0.01', 'ether')
const oracleAddress = '0x0000000000000000000000000000000000000000'

async function deploy (deployer) {
  await deployer.deploy(Users, attestationFee, oracleAddress)
  await deployer.deploy(SustainableSource, Users.address, repo, licenseFee)
}

module.exports = function (deployer) {
  // workaround for https://github.com/trufflesuite/truffle/issues/501:
  deployer.then(() => deploy(deployer))
}
