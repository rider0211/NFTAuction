import hre from "hardhat";

async function verify() {
    const contract = process.env.CONTRACT;

    await hre.run('verify:verify', {
        address: contract,
    });
}

verify().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
