/* eslint-env mocha */
const expect = require('chai').expect
const PullRequests = artifacts.require('PullRequests')

contract('PullRequests', function () {
  it('is deployed', async function () {
    expect(await PullRequests.deployed()).to.exist
  })
})
