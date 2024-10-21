require("@nomicfoundation/hardhat-toolbox")
require("@chainlink/env-enc").config()
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  }
}


task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners()
  for (const account of accounts) {
    console.log(account.address)
  }
})