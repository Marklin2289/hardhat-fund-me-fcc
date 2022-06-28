// traditionally what we do :
// import
// main function
// calling of main function

// what @nomiclabs-deploy do is :
// =====================================================
// function deployFunc(hre) {
//     console.log("Hi,this is deploy function")
//     hre.getNamedAccounts()
//     hre.deployments
// }

// module.exports.default = deployFunc
// ====================================================== or below :

// module.exports = async (hre) => {
// const { getNamedAccounts, deployments } = hre
// hre.getNameAccounts
// hre.deployments
// }

// import helper-hardhat-config.js
const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
//another simple way
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is X, use address Y, we can learn from AAVE
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundme"]

// const { getNamedAccounts, deployments, network } = require("hardhat")
// const { networkConfig, developmentChains } = require("../helper-hardhat-config")
// const { verify } = require("../utils/verify")

// module.exports = async ({ getNamedAccounts, deployments }) => {
//     const { deploy, log } = deployments
//     const { deployer } = await getNamedAccounts()
//     const chainId = network.config.chainId

//     let ethUsdPriceFeedAddress
//     if (chainId == 31337) {
//         const ethUsdAggregator = await deployments.get("MockV3Aggregator")
//         ethUsdPriceFeedAddress = ethUsdAggregator.address
//     } else {
//         ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
//     }
//     log("----------------------------------------------------")
//     log("Deploying FundMe and waiting for confirmations...")
//     const fundMe = await deploy("FundMe", {
//         from: deployer,
//         args: [ethUsdPriceFeedAddress],
//         log: true,
//         // we need to wait if on a live network so we can verify properly
//         waitConfirmations: network.config.blockConfirmations || 1,
//     })
//     log(`FundMe deployed at ${fundMe.address}`)

//     if (
//         !developmentChains.includes(network.name) &&
//         process.env.ETHERSCAN_API_KEY
//     ) {
//         await verify(fundMe.address, [ethUsdPriceFeedAddress])
//     }
// }

// module.exports.tags = ["all", "fundme"]
