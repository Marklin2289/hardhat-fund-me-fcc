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

//another simple way
module.exports = async ({ getNameAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNameAccounts()
    const chainId = network.config.chainId

    // well what happens when we want to change
    // when going for localhost or hardhat network we want to use a mock
}
