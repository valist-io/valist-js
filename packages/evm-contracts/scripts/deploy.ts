const hre = require("hardhat");

async function main() {
  const Valist = await hre.ethers.getContractFactory("Valist");
  const valist = await Valist.deploy(
    "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b"
  );

  await valist.deployed();
  console.log("Valist deployed to:", valist.address);
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
