const hre = require("hardhat");

async function main() {

    const Voting =
        await hre.ethers.getContractFactory(
            "SimpleVoting"
        );

    const voting =
        await Voting.deploy();

    await voting.waitForDeployment();

    const address =
        await voting.getAddress();

    console.log(
        "Contract deployed to:",
        address
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});