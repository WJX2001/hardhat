const { assert } = require('chai')
const { ethers, deployments, getNamedAccounts } = require('hardhat')

describe('test fundme contract', async function () {
  let fundMe
  let firstAccount
  beforeEach(async function () {
    await deployments.fixture(['all']) // 部署了所有tag为all的合约
    firstAccount = (await getNamedAccounts()).firstAccount
    const fundMeDeployMent = await deployments.get('FundMe')
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployMent.address)
  })

  it('test if owner is msg.sender', async function () {
    await fundMe.waitForDeployment()
    assert.equal(await fundMe.owner(), firstAccount)
  })
})
