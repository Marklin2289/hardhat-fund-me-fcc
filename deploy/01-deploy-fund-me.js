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
const { networkConfig } = require("../helper-hardhat-config")

const { network } = require("hardhat")
//another simple way
module.exports = async ({ getNameAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNameAccounts()
    const chainId = network.config.chainId

    // if chainId is X, use address Y, we can learn from AAVE
    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    // if the contract doesn't exist, we deploy a minimal version  of
    // for our local testing

    // well what happens when we want to change
    // when going for localhost or hardhat network we want to use a mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [
            /* address from constructor */
        ], // put price feed address
        log: true,
    })
}
