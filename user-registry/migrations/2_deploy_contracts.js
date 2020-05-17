const Users = artifacts.require('Users.sol')

const attestationPrice = web3.utils.toWei('0.01', 'ether')
const oracleAddress = '0x0000000000000000000000000000000000000000'

module.exports = function (deployer) {
  deployer.deploy(Users, attestationPrice, oracleAddress)
}
