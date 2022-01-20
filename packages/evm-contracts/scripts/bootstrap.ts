const httpapi = require("ipfs-http-client");

const PinRepoMeta = async () => {
  const ipfs = httpapi.create();
  const meta = JSON.stringify({
    name: "test",
    description: "A test project description.",
  });
  const { cid } = await ipfs.add(meta);
  return cid.toString();
};

async function PinOrgMeta() {
  const ipfs = httpapi.create();
  const meta = JSON.stringify({
    name: "test",
    description: "A test account description.",
  });
  const { cid } = await ipfs.add(meta);
  return cid.toString();
}

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
  const valist = await Valist.deploy(
    "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b"
  );
  await valist.deployed();

  console.log("Valist deployed to:", valist.address);
  console.log();

  const teamNames1 = ["test1", "test2", "test3", "test4"];
  // const orgNames2 = ["test5", "test6", "test7", "test8"];
  const projectName = "test";
  const teamMetaCid = await PinOrgMeta();
  const projectMetaCid = await PinRepoMeta();
  const releaseMetaCid = await PinReleaseMeta();
  console.log("Team Meta CID", teamMetaCid);
  console.log("Project Meta CID", projectMetaCid);
  console.log("Release Meta CID", releaseMetaCid);
  console.log();

  const account0 = await accounts[0].getAddress();
  const account1 = await accounts[1].getAddress();
  const account2 = await accounts[2].getAddress();
  console.log("Account 0", account0);
  console.log("Account 1", account1);
  console.log("Account 2", account2);
  console.log();

  for (let i = 0; i < teamNames1.length; i++) {
    console.log("Creating Team", teamNames1[i]);
    const createTeamTx = await valist.createTeam(teamNames1[i], teamMetaCid, [
      account0,
    ]);
    await createTeamTx.wait();

    console.log("Creating Project", teamNames1[i], projectName);
    const createProjectTx = await valist.createProject(
      teamNames1[i],
      projectName,
      projectMetaCid,
      [account0]
    );
    await createProjectTx.wait();

    // const project = await valist.getProjectMembers(
    //   teamNames1[i],
    //   projectName,
    //   1,
    //   10
    // );
    // console.log("Project Members", project);

    console.log(`Add addr1(${account1}) as projectMember`);
    const addProjectMemberTx = await valist.addProjectMember(
      teamNames1[i],
      projectName,
      account1
    );
    await addProjectMemberTx.wait();

    console.log("Publishing Release to", `${teamNames1[i]}/${projectName}`);
    await valist.createRelease(
      teamNames1[i],
      projectName,
      "0.0.1",
      releaseMetaCid
    );
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
