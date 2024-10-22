const { assert } = require('chai')
const { ethers } = require('hardhat')

describe('test fundme contract', async function () {
  it('test if owner is msg.sender', async function () {
    // 获取部署合约的交易人
    const [firstAccount] = await ethers.getSigners()
    const fundMeFactory = await ethers.getContractFactory('FundMe')
    const fundMe = await fundMeFactory.deploy(180)
    await fundMe.waitForDeployment()
    assert.equal((await fundMe.owner()), firstAccount.address)
  })
})
