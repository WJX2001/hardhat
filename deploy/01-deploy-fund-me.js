// TODO: 写法一
// function deployFunction () {
//   console.log("this is a deploy function")
// }

// TODO: 写法二
// module.exports.default = deployFunction


// TODO: 写法三 
// hre是运行时环境
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { firstAccount } = await getNamedAccounts()
  const { deploy } = deployments

  await deploy("FundMe", {
    from: firstAccount,
    args: [180],
    log: true,
  })
}

module.exports.tags = ["all", "fundme"]