const { task } = require('hardhat/config')

task('interact-fundme', "interact with fundme contract")
  .addParam("addr", "fundme contract address")
  .setAction(async (taskArgs, hre) => {
    const fundMeFactory = await ethers.getContractFactory('FundMe')
    const fundMe = fundMeFactory.attach(taskArgs.addr)

    const [firstAccount, secondAccount] = await ethers.getSigners()
    // fund contract with first account
    const fundTx = await fundMe.fund({ value: ethers.parseEther('0.1') })
    await fundTx.wait()

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`balance of contract is ${balanceOfContract}`)

    // fund contract with second accout
    const fundTxWithSecondAccount = await fundMe
      .connect(secondAccount)
      .fund({ value: ethers.parseEther('0.1') })
    await fundTxWithSecondAccount.wait()

    // check balance of contract
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(
      fundMe.target,
    )
    console.log(`balance of contract is ${balanceOfContractAfterSecondFund}`)

    // check mapping fundersToAmount
    const firstAccountBalanceInFundMe = await fundMe.funderToAmount(
      firstAccount.address,
    )
    const secondAccountBalanceInFundMe = await fundMe.funderToAmount(
      secondAccount.address,
    )
    console.log(
      `Balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`,
    )
    console.log(
      `Balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`,
    )
  })
