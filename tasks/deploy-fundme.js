const { task } = require('hardhat/config')
require("@chainlink/env-enc").config()
task('deploy-fundme', "deploy and verify fundme contract").setAction(async (taskArgs, hre) => {
  const fundMeFactory = await ethers.getContractFactory('FundMe')
  console.log("contract deploying...")
  const fundMe = await fundMeFactory.deploy(300)
  await fundMe.waitForDeployment()
  console.log(
    'contract has been deployed successfully, contract address is' +
    fundMe.target,
  )
  // 等五个区块验证合约
  // verify fundme
  if (
    hre.network.config.chainId == 11155111 &&
    process.env.ETH_VERIFY_API_KEY
  ) {
    console.log('waiting for 5 confirmations...')
    await fundMe.deploymentTransaction().wait()
    await verifyFundMe(fundMe.target, [300])
  } else {
    console.log('verification skipped')
  }
})

async function verifyFundMe (fundMeAddr, args) {
  await hre.run('verify:verify', {
    address: fundMeAddr,
    constructorArguments: args,
  })
}

module.exports = {}
