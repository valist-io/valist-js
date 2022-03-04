const hre = require("hardhat");

// Change this when deploying to other live networks
const biconomyForwarderAddress = "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b";

async function main() {
  const Valist = await hre.ethers.getContractFactory("Valist");
  const valist = await Valist.deploy(
    biconomyForwarderAddress,
  );

  await valist.deployed();
  console.log("Valist deployed to:", valist.address);

  const License = await hre.ethers.getContractFactory("SoftwareLicense");
  const license = await License.deploy(
    valist.address,
    biconomyForwarderAddress,
  );

  await license.deployed();
  console.log("SoftwareLicense deployed to:", license.address);
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
