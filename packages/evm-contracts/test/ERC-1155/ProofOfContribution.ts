import { expect } from "chai";
import { ethers } from "hardhat";

import { getAddresses, deployValist } from "..";

describe("PROOOOOOOOOOOF", () => {
    it("PROOF OF CONTRIBUTION", async function() {
      const valist = await deployValist();
      const members = await getAddresses();
      const signers = await ethers.getSigners();
  
      const createTeamTx = await valist.createTeam("acme", "Qm", members);
      await createTeamTx.wait();
  
      const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
      await createProjectTx.wait();
  
      const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
      await createReleaseTx.wait();
  
      for (let i = 0; i < signers.length; i++) {
        const approveReleaseTx = await valist.connect(signers[i]).approveRelease("acme", "bin", "0.0.1");
        await approveReleaseTx.wait();  
      }
  
      const page1 = await valist.getReleaseApprovers("acme", "bin", "0.0.1", 0, 10);
      expect(page1).to.have.ordered.members(members.slice(0, 10));
  
      const page2 = await valist.getReleaseApprovers("acme", "bin", "0.0.1", 1, 10);
      expect(page2).to.have.ordered.members(members.slice(10, 20));
    });
  });
  