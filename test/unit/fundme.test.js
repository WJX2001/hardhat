const { assert, expect } = require('chai')
const { ethers, deployments, getNamedAccounts } = require('hardhat')
const helpers = require('@nomicfoundation/hardhat-network-helpers')
describe('test fundme contract', async function () {
  let fundMe
  let firstAccount
  let mockV3Aggregator
  beforeEach(async function () {
    await deployments.fixture(['all']) // 部署了所有tag为all的合约
    firstAccount = (await getNamedAccounts()).firstAccount
    const fundMeDeployMent = await deployments.get('FundMe')
    mockV3Aggregator = await deployments.get('MockV3Aggregator')
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployMent.address)
  })

  it('test if owner is msg.sender', async function () {
    await fundMe.waitForDeployment()
    assert.equal(await fundMe.owner(), firstAccount)
  })

  // it("test if the dataFeed is assigned correctly", async function() {
  //   await fundMe.waitForDeployment()
  //   assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address)
  // })


  // fund, getFund, refund
  // unit test for fund
  // window open, value greater then minimum value, funder balance
  it("window closed, value grater than minimum, fund failed", async function () {
    // 模拟时间流逝(模拟过期的情况)
    // make sure the window is closed
    await helpers.time.increase(200)
    await helpers.mine()

    // value is greater minimum value
    expect(fundMe.fund({ value: ethers.parseEther("0.1") }))
      .to.be.rejectedWith("window is closed") // wei
  })

  it("window open, value is less than minimum, fund failed", async function () {
    expect(fundMe.fund({ value: ethers.parseEther("0.01") }))
      .to.be.rejectedWith("Send more ETH") // wei
  })
})
