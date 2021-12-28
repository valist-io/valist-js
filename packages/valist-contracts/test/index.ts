/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("Valist Contract", () => {
  const orgName = "testOrg";
  const repoName = "testRepo";
  const releaseCID = "bafybeig5g7gpjxl5mmkufdkf4amj4ttmy4eni5ghgi4huw5w57s6e3cf6y";
  const metaCID = "bafybeigmfwlweiecbubdw4lq6uqngsioqepntcfohvrccr2o5f7flgydme";
  let valist: Contract;
  let accounts: Signer[];
  let orgID: string;

  const ADD_KEY = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["ADD_KEY_OPERATION"])
  );

  const REVOKE_KEY = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["REVOKE_KEY_OPERATION"])
  );

  const ROTATE_KEY = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["ROTATE_KEY_OPERATION"])
  );

  const ORG_ADMIN = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["ORG_ADMIN_ROLE"])
  );

  const REPO_DEV = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["REPO_DEV_ROLE"])
  );

  // const repoSelector = ethers.utils.keccak256(
  //   ethers.utils.solidityPack(["bytes32", "string"], [orgID, repoName])
  // );

  before(async () => {
    // Deploy Valist Contract
    const Valist = await ethers.getContractFactory("Valist");
    valist = await Valist.deploy("0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b");
    await valist.deployed();
    // Setup Accounts and Constants
    accounts = await ethers.getSigners();
  });

  describe("Create an organization", async () => {
    let orgTx;
    let orgTxRec;
    let parsedOrgCreated;
    let parsedVoteKey: any;

    before(async () => {
      orgTx = await valist.createOrganization(metaCID);
      orgTxRec = await orgTx.wait();
      parsedOrgCreated = valist.interface.parseLog(orgTxRec.logs[0]);
      parsedVoteKey = valist.interface.parseLog(orgTxRec.logs[1]);
      orgID = parsedOrgCreated.args[0];
    });

    it("Should call vote key event", async () => {
      console.log(parsedVoteKey.args);
      expect(parsedVoteKey.args).lengthOf(5);
    });

    it("Should create testOrg organization", async () => {
      await valist.linkNameToID(orgID, orgName);
    });

    it("Should fetch orgID from orgName", async () => {
      const _orgID = await valist.nameToID(orgName);
      expect(_orgID).to.equal(orgID);
    });

    // it("Org ID should be generated using keccak256(++orgCount, chainID)", async () => {
    //   const expectedOrgID = ethers.utils.keccak256(
    //     ethers.utils.solidityPack(
    //       ["uint", "uint"],
    //       [await valist.orgCount(), 31337]
    //     )
    //   );
    //   expect(orgID).to.equal(expectedOrgID);
    // });

    it("Creator should be an organization admin", async () => {
      expect(await valist.isOrgAdmin(orgID, await accounts[0].getAddress())).to
        .be.true;
    });
  });

  describe("Create a repository", () => {
    it("Should create a repo under testOrg", async () => {
      await valist.createRepository(orgID, repoName, metaCID);
    });

    it("Role list should be updated", async () => {
      const roleSelector = ethers.utils.keccak256(
        ethers.utils.solidityPack(["bytes32", "bytes32"], [orgID, ORG_ADMIN])
      );
      const orgAdmins = await valist.getRoleMembers(roleSelector);
      expect(orgAdmins[0]).to.equal(await accounts[0].getAddress());
    });

    it("Add addr2 as repoDev under testRepo", async () => {
      await valist.voteKey(
        orgID,
        repoName,
        ADD_KEY,
        await accounts[1].getAddress()
      );

      expect(
        await valist.isRepoDev(orgID, repoName, await accounts[1].getAddress())
      ).to.be.true;
    });

    it("Add addr3 as repoDev under testRepo", async () => {
      await valist.voteKey(
        orgID,
        repoName,
        ADD_KEY,
        await accounts[2].getAddress()
      );

      expect(
        await valist.isRepoDev(orgID, repoName, await accounts[2].getAddress())
      ).to.be.true;
    });
  });

  describe("Publish a release", () => {
    it("Should publish a release under testOrg/testRepo", async () => {
      const releaseSelector = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "string", "string"],
          [orgID, repoName, "0.0.1"]
        )
      );
      await valist.voteRelease(orgID, repoName, "0.0.1", releaseCID);
      const release = await valist.releases(releaseSelector);
      expect(release).to.equal(releaseCID);
    });

    it("Should fetch release using releaseSelector", async () => {
      const releaseSelector = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "string", "string"],
          [orgID, repoName, "0.0.1"]
        )
      );
      const release = await valist.releases(releaseSelector);
      expect(release).to.equal(releaseCID);
    });

    it("Should fetch release using getLatestRelease", async () => {
      const release = await valist.getLatestRelease(orgID, repoName);
      expect(release[0]).to.equal("0.0.1");
      expect(release[1]).to.equal(releaseCID);
    });

    it("Should fail to propose release that has been finalized", async () => {
      try {
        await valist.voteRelease(orgID, repoName, "0.0.1", releaseCID);
      } catch (e: any) {
        expect(e.message).to.contain("Tag used");
      }
    });
  });

  describe("Add, rotate, & remove repo keys", () => {
    it("Add addr4 as repoDev under testRepo", async () => {
      const voteKeyTx = await valist.voteKey(
        orgID,
        repoName,
        ADD_KEY,
        await accounts[3].getAddress()
      );

      const voteKeyTxRec = await voteKeyTx.wait();
      const parsedVoteKey = valist.interface.parseLog(voteKeyTxRec.logs[0]);
      expect(parsedVoteKey.args[1]).to.equal("testRepo");
    });

    it("Validate that addr 4 is now repo dev", async () => {
      expect(
        await valist.isRepoDev(orgID, repoName, await accounts[3].getAddress())
      ).to.be.true;
    });

    it("Should fail to vote when key is already added", async () => {
      try {
        await valist.voteKey(
          orgID,
          repoName,
          ADD_KEY,
          await accounts[3].getAddress()
        );
      } catch (e: any) {
        expect(e.message).to.contain("Key exists");
      }
    });

    it("Revoke addr 4", async () => {
      await valist.voteKey(
        orgID,
        repoName,
        REVOKE_KEY,
        await accounts[3].getAddress()
      );
    });

    it("Addr 4 should no longer have access", async () => {
      expect(
        await valist.isRepoDev(orgID, repoName, await accounts[3].getAddress())
      ).to.be.false;
    });

    it("Role list should be updated", async () => {
      let roleSelector = ethers.utils.keccak256(
        ethers.utils.solidityPack(
          ["bytes32", "string", "bytes32"],
          [orgID, repoName, REPO_DEV]
        )
      );
      const repoDevs = await valist.getRoleMembers(roleSelector);
      roleSelector = ethers.utils.keccak256(
        ethers.utils.solidityPack(["bytes32", "bytes32"], [orgID, ORG_ADMIN])
      );
      const orgAdmins = await valist.getRoleMembers(roleSelector);
      expect(repoDevs[0]).to.equal(await accounts[1].getAddress());
      expect(repoDevs[1]).to.equal(await accounts[2].getAddress());
      expect(orgAdmins[0]).to.equal(await accounts[0].getAddress());
    });

    it("Should allow self-serve key rotation", async () => {
      await valist.voteKey(
        orgID,
        "",
        ROTATE_KEY,
        await accounts[4].getAddress()
      );
    });

    it("Should disallow rotating a key with a mismatched role", async () => {
      try {
        await valist
          .connect(accounts[4])
          .voteKey(orgID, repoName, ROTATE_KEY, await accounts[5].getAddress());
      } catch (e: any) {
        expect(e.message).to.contain("Denied");
      }
    });

    it("Role list should be updated", async () => {
      let roleSelector = ethers.utils.keccak256(
        ethers.utils.solidityPack(
          ["bytes32", "string", "bytes32"],
          [orgID, repoName, REPO_DEV]
        )
      );
      const repoDevs = await valist.getRoleMembers(roleSelector);
      roleSelector = ethers.utils.keccak256(
        ethers.utils.solidityPack(["bytes32", "bytes32"], [orgID, ORG_ADMIN])
      );
      const orgAdmins = await valist.getRoleMembers(roleSelector);
      expect(repoDevs[0]).to.equal(await accounts[1].getAddress());
      expect(repoDevs[1]).to.equal(await accounts[2].getAddress());
      expect(orgAdmins[0]).to.equal(await accounts[4].getAddress());
    });
  });

  describe("Read from Valist contract", () => {
    it("Should get testOrg metadata", async () => {
      const org = await valist.orgs(orgID);
      expect(org).to.equal(metaCID);
    });

    it("Should get 10 orgNames", async () => {
      const orgNames = await valist.getNames(1, 10);
      expect(orgNames[0]).to.equal("testOrg");
      expect(orgNames.length).to.equal(10);
    });

    it("Should get number of orgs", async () => {
      expect(await valist.orgCount()).to.equal(1);
    });
  });
});
