import path from "path";

/* eslint-disable no-process-exit */
const httpapi = require("ipfs-http-client");
const fs = require("fs");

async function PinTeamMeta() {
  const ipfs = httpapi.create();
  const imageFile = fs.readFileSync(
    path.join(__dirname, "data/valist-test.jpg")
  );
  const imagePin = await ipfs.add(imageFile);

  /* Pin Empty Image Team Meta */
  const empty = JSON.stringify({
    image: "",
    name: "test",
    description: "An example library for demoing valist.",
    external_url: "https://example.com",
  });
  const resp = await ipfs.add(empty);
  console.log("Empty meta CID", resp.cid.toString());

  const meta = JSON.stringify({
    image: 'http://localhost:8080/ipfs/' + imagePin.cid.toString(),
    name: "test team",
    description: "A test team description.",
    external_url: "https://example.com",
  });
  const { cid } = await ipfs.add(meta);
  return 'http://localhost:8080/ipfs/' + cid.toString();
}

const PinProjectMeta = async () => {
  const ipfs = httpapi.create();
  const imageFile = fs.readFileSync(
    path.join(__dirname, "data/valist-test.jpg")
  );
  const imagePin = await ipfs.add(imageFile);

  const meta = JSON.stringify({
    image: 'http://localhost:8080/ipfs/' + imagePin.cid.toString(),
    name: "test project",
    description: "An example library for demoing valist.",
    external_url: "https://git.example.com",
  });
  const metaPin = await ipfs.add(meta);
  return 'http://localhost:8080/ipfs/' + metaPin.cid.toString();
};

const PinReleaseMeta = async () => {
  const ipfs = httpapi.create();
  const imageFile = fs.readFileSync(
    path.join(__dirname, "data/valist-test.jpg")
  );
  const imagePin = await ipfs.add(imageFile);

  const meta = JSON.stringify({
    image: 'http://localhost:8080/ipfs/' + imagePin.cid.toString(),
    name: "test/test/0.0.1",
    description: "# Test Project\n\nThis folder contains the test project library with test code for IPFS and Ethereum.\n\n## Documentation\n\nFor the TypeScript API documentation, please see the following link:\n\n* [API Docs](https://docs.example.com/)\n\n## Installation\n\n```shell\nnpm install\n```\n\n## Building\n\n```shell\nnpm run build\n```\n\n## Linting\n\n```shell\nnpm run lint\n```\n",
    external_url: "http://localhost:8080/ipfs/QmcLspRr6QBoktravDHC6LopEczLUNvRm28T1HbKtgS9eN"
  });
  const { cid } = await ipfs.add(meta);
  return 'http://localhost:8080/ipfs/' + cid.toString();
};

async function bootstrap() {
  const accounts = await hre.ethers.getSigners();
  const valist = await hre.ethers.getContractAt(
    "Valist",
    "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
  );

  const teamNames1 = ["test1", "test2", "test3", "test4"];
  const projectNames = ["geth", "ipfs", "ganache", "bor"];
  const teamMetaCid = await PinTeamMeta();
  const projectMetaCid = await PinProjectMeta();
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
    const createTeamTx = await valist.createTeam(
      teamNames1[i],
      teamMetaCid,
      account0,
      [account0]
    );
    await createTeamTx.wait();

    console.log("Creating Project", teamNames1[i], projectNames[i]);
    const createProjectTx = await valist.createProject(
      teamNames1[i],
      projectNames[i],
      projectMetaCid,
      [account0]
    );
    await createProjectTx.wait();

    console.log(`Add addr1(${account1}) as projectMember`);
    const addProjectMemberTx = await valist.addProjectMember(
      teamNames1[i],
      projectNames[i],
      account1
    );
    await addProjectMemberTx.wait();

    console.log("Publishing Release to", `${teamNames1[i]}/${projectNames[i]}`);
    await valist.createRelease(
      teamNames1[i],
      projectNames[i],
      "0.0.1",
      releaseMetaCid
    );
    console.log();
  }
}

bootstrap()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
