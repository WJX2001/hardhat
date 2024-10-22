// TODO: 写法一
// function deployFunction () {
//   console.log("this is a deploy function")
// }

const { network } = require("hardhat")
const { devlopmentChains, networkConfig, LOCK_TIME, CONFIRMATIONS } = require("../helper-hardhat-config")
// TODO: 写法二
// module.exports.default = deployFunction


// TODO: 写法三 
// hre是运行时环境
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { firstAccount } = await getNamedAccounts()
  const { deploy } = deployments
  let dataFeedAddr
  // 等待的区块
  let confirmations

  if (devlopmentChains.includes(network.name)) {
    // 通过deployments找到部署过的合约
    const mockV3Aggregator = await deployments.get("MockV3Aggregator")
    dataFeedAddr = mockV3Aggregator.address
    confirmations = 0
  } else {
    dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
    confirmations = CONFIRMATIONS
  }

  const fundMe = await deploy("FundMe", {
    from: firstAccount,
    args: [LOCK_TIME, dataFeedAddr],
    log: true,
    waitConfirmations: confirmations
  })

  // remove deployments directory or add --reset flag if you redeploy contract

  if (hre.network.config.chainId == 11155111 && process.env.ETH_VERIFY_API_KEY) {
    await hre.run('verify:verify', {
      address: fundMe.address,
      constructorArguments: [LOCK_TIME, dataFeedAddr],
    })
  } else {
    console.log("Network is not sepolia, verification skipped")
  }

}

module.exports.tags = ["all", "fundme"]