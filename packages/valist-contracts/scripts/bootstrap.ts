const httpapi = require("ipfs-http-client");

interface Args {
  valist: string;
}

const PinRepoMeta = async () => {
  const ipfs = httpapi.create();
  const meta = JSON.stringify({
    name: "test",
    description: "A test project description.",
  });
  const { cid } = await ipfs.add(meta);
  return cid.toString();
};

const PinOrgMeta = async () => {
  const ipfs = httpapi.create();
  const meta = JSON.stringify({
    name: "test",
    description: "A test account description.",
  });
  const { cid } = await ipfs.add(meta);
  return cid.toString();
};

const PinReleaseMeta = async () => {
  const ipfs = httpapi.create();
  const meta = JSON.stringify({
    name: "valist/sdk/0.5.2",
    readme:
      "# Valist SDK\n\nThis folder contains the Valist SDK/core library that bridges the IPFS and Ethereum networks.\n\n## Documentation\n\nFor the TypeScript API documentation, please see the following link:\n\n* [TypeScript API Docs](https://docs.valist.io/lib/classes/_index_.valist.html)\n\n## Installation\n\n```shell\nnpm install\n```\n\n## Building\n\n```shell\nnpm run build\n```\n\n## Linting\n\n```shell\nnpm run lint\n```\n",
    version: "0.5.2",
    license: "MPL-2.0",
    dependencies: [
      "encoding",
      "eth-sig-util",
      "ipfs-http-client",
      "node-fetch",
      "web3",
      "web3-core",
    ],
    artifacts: {
      "@valist/sdk-0.5.2.tgz": {
        sha256: "",
        provider: "/ipfs/QmcLspRr6QBoktravDHC6LopEczLUNvRm28T1HbKtgS9eN",
      },
      "doc.json": {
        sha256: "",
        provider: "/ipfs/QmQsWXTuKkvpQtVRhnGvGrnQCzoK4vwo59MGcKWFGW9mrJ",
      },
    },
  });
  const { cid } = await ipfs.add(meta);
  return cid.toString();
};

async function bootstrap() {
  const accounts = await hre.ethers.getSigners();
  const Valist = await hre.ethers.getContractFactory("Valist");
  const valist = await Valist.deploy();
  await valist.deployed();

  const ADD_KEY = hre.ethers.utils.keccak256(
    hre.ethers.utils.solidityPack(["string"], ["ADD_KEY_OPERATION"])
  );

  console.log("Valist deployed to:", valist.address);
  console.log();

  const metaCID = "bafybeigmfwlweiecbubdw4lq6uqngsioqepntcfohvrccr2o5f7flgydme";
  const orgNames1 = ["test1", "test2", "test3", "test4"];
  const orgNames2 = ["test5", "test6", "test7", "test8"];
  const repoName = "test";
  const repoMetaCid = await PinRepoMeta();
  const orgMetaCid = await PinOrgMeta();
  const releaseMetaCid = await PinReleaseMeta();
  console.log("Repo Meta CID", repoMetaCid);
  console.log("Org Meta CID", orgMetaCid);
  console.log("Release Meta CID", releaseMetaCid);
  console.log();

  for (let i = 0; i < orgNames1.length; i++) {
    console.log("Creating org", orgNames1[i]);
    const orgTx = await valist.createOrganization(orgMetaCid);
    const orgTxRec = await orgTx.wait();
    const parsed = valist.interface.parseLog(orgTxRec.logs[0]);
    const orgID = parsed.args[0];

    console.log("Linking Org ID", orgID, "to", orgNames1[i]);
    await valist.linkNameToID(orgID, orgNames1[i]);

    console.log("Creating repo", orgNames1[i], repoName);
    await valist.createRepository(orgID, repoName, repoMetaCid);

    console.log("Add addr1 as repoDev", await accounts[1].getAddress());
    await valist.voteKey(
      orgID,
      repoName,
      ADD_KEY,
      await accounts[1].getAddress()
    );

    console.log("Publishing release to", `${orgNames1[i]}/${repoName}`);
    await valist.voteRelease(
      orgID,
      repoName,
      "0.0.1",
      releaseMetaCid,
      metaCID
    );
    console.log();
  }

  for (let i = 0; i < orgNames2.length; i++) {
    console.log("Creating org", orgNames2[i]);
    const orgTx = await valist
      .connect(accounts[2])
      .createOrganization(metaCID);

    const orgTxRec = await orgTx.wait();
    const parsed = valist.interface.parseLog(orgTxRec.logs[0]);
    const orgID = parsed.args[0];

    console.log("Linking Org ID", orgID, "to", orgNames2[i]);
    await valist
      .connect(accounts[2])
      .linkNameToID(orgID, orgNames2[i]);

    console.log("Creating repo", orgNames2[i], repoName);
    await valist
      .connect(accounts[2])
      .createRepository(orgID, repoName, repoMetaCid);

    console.log("Add addr1 as repoDev", await accounts[3].getAddress());
    await valist
      .connect(accounts[2])
      .voteKey(orgID, repoName, ADD_KEY, await accounts[3].getAddress());

    console.log("Publishing release to", `${orgNames2[i]}/${repoName}`);
    await valist
      .connect(accounts[2])
      .voteRelease(orgID, repoName, "0.0.1", releaseMetaCid, metaCID);
    console.log();
  }
}

bootstrap()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
