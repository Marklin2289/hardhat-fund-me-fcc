// traditionally what we do :
// import
// main function
// calling of main function

// what @nomiclabs-deploy do is :
// =====================================================
// function deployFunc(hre) {
//     console.log("Hi,this is deploy function")
//     hre.getNameAccounts()
//     hre.deployments
// }

// module.exports.default = deployFunc
// ====================================================== or below :

// module.exports = async (hre) => {
// const { getNameAccounts, deployments } = hre
// hre.getNameAccounts
// hre.deployments
// }

// import helper-hardhat-config.js
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

const { network } = require("hardhat")
const { verify } = require("../utils/verify")
//another simple way
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is X, use address Y, we can learn from AAVE
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // if the contract doesn't exist, we deploy a minimal version  of
    // for our local testing

    // well what happens when we want to change
    // when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [
            /* address from constructor */
            args,
        ], // put price feed address
        log: true,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // VERIFY
        await verify(fundMe.address, args)
    }

    log("-------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
