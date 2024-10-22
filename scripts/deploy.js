
/**
 * init 2 accounts
 * fund contract with first account
 * check balance of contract
 * fund contract with second accout
 * check balance of contract
 * check mapping  fundersToAmount
 */


const { ethers } = require('hardhat')
require("@chainlink/env-enc").config()
async function main () {
  // create factory
  const fundMeFactory = await ethers.getContractFactory('FundMe')
  // deploy contract from factory
  const fundMe = await fundMeFactory.deploy(10)
  await fundMe.waitForDeployment()
  console.log(
    'contract has been deployed successfully, contract address is' +
    fundMe.target,
  )

  // 等五个区块验证合约
  // verify fundme
  if (hre.network.config.chainId == 11155111 && process.env.ETH_VERIFY_API_KEY) {
    console.log('waiting for 5 confirmations...')
    await fundMe.deploymentTransaction().wait()
    await verifyFundMe(fundMe.target, [10])
  } else {
    console.log("verification skipped")
  }

}

async function verifyFundMe (fundMeAddr, args) {
  await hre.run('verify:verify', {
    address: fundMeAddr,
    constructorArguments: args,
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
