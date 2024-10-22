const { ethers } = require('hardhat')
require("@chainlink/env-enc").config()
async function main () {
  // create factory
  const fundMeFactory = await ethers.getContractFactory('FundMe')
  // deploy contract from factory
  const fundMe = await fundMeFactory.deploy(300)
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
    await verifyFundMe(fundMe.target, [300])
  } else {
    console.log("verification skipped")
  }

  /**
 * init 2 accounts
 * fund contract with first account
 * check balance of contract
 * fund contract with second accout
 * check balance of contract
 * check mapping  fundersToAmount
 */

  // init 2 accounts
  const [firstAccount, secondAccount] = await ethers.getSigners()

  // fund contract with first account
  const fundTx = await fundMe.fund({ value: ethers.parseEther("0.1") })
  await fundTx.wait()

  // check balance of contract
  const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
  console.log(`balance of contract is ${balanceOfContract}`)

  // fund contract with second accout
  const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.1") })
  await fundTxWithSecondAccount.wait()

  // check balance of contract
  const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
  console.log(`balance of contract is ${balanceOfContractAfterSecondFund}`)

  // check mapping fundersToAmount
  const firstAccountBalanceInFundMe = await fundMe.funderToAmount(firstAccount.address)
  const secondAccountBalanceInFundMe = await fundMe.funderToAmount(secondAccount.address)
  console.log(`Balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
  console.log(`Balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)
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
