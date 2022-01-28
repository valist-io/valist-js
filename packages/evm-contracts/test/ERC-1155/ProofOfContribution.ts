import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

import { getAddresses, deployValist } from "..";

export async function deployProofOfContribution(registryAddress: string) {
    const PoCFactory = await ethers.getContractFactory("ProofOfContribution");
    const PoC = await PoCFactory.deploy(registryAddress, "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b");
    
    await PoC.deployed();
    return PoC;
  }

// {
//     "name": "Proof of Contribution",
//     "symbol": "CONTRIB",
//     "description": "Valist Proof of Contribution NFT",
//     "image": "https://gateway.valist.io/ipfs/QmfPeC65TKPbA3dxE314Boh82LX5NpkcrPXonCxUuKh6vr"
// }
const metaURI = "/ipfs/QmNjwLntRGfSrWo1y2DYYZaXFoRioNGCGtAXRknYZ8Foqd";

describe("Proof of Contribution", () => {
    it("Should mint to a single contributor", async function() {
        this.timeout(1000000);
        const valist = await deployValist();
        const proof = await deployProofOfContribution(valist.address);

        const signers = await ethers.getSigners();
    
        const createTeamTx = await valist.createTeam("acme", metaURI, [signers[0].address]);
        await createTeamTx.wait();
    
        const createProjectTx = await valist.createProject("acme", "bin", metaURI, []);
        await createProjectTx.wait();
    
        const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.2", metaURI);
        await createReleaseTx.wait();
  
        const mintContributionTx = await proof.mint("acme", "bin", "0.0.2", signers[0].address);
        await mintContributionTx.wait();
  
        const teamID = await valist.getTeamID("acme");
        const projectID = await valist.getProjectID(teamID, "bin");
        const releaseID = await valist.getReleaseID(projectID, "0.0.2");
        
        const balance = await proof.balanceOf(signers[0].address, releaseID);
        expect(balance).to.equal(BigNumber.from(1));

        const uri = await proof.uri(releaseID);
        expect(uri).to.equal(`https://gateway.valist.io${metaURI}`);
      });

      it("Should fail to mint when release does not exist", async function() {
        this.timeout(1000000);
        const valist = await deployValist();
        const proof = await deployProofOfContribution(valist.address);

        const metaURI = "/ipfs/QmVteGgoFEZtnY2CCpt4rRdTSFkQucqo5wPibD5xJXoiQJ";

        const signers = await ethers.getSigners();
    
        const createTeamTx = await valist.createTeam("acme", metaURI, [signers[0].address]);
        await createTeamTx.wait();
    
        const createProjectTx = await valist.createProject("acme", "bin", metaURI, []);
        await createProjectTx.wait();
    
        const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", metaURI);
        await createReleaseTx.wait();
  
        await expect(proof.mint("acme", "bin", "0.0.2", signers[0].address))
            .to.be.revertedWith('err-release-not-exist');
        
  
        const teamID = await valist.getTeamID("acme");
        const projectID = await valist.getProjectID(teamID, "bin");
        const releaseID = await valist.getReleaseID(projectID, "0.0.2");
        
        const balance = await proof.balanceOf(signers[0].address, releaseID);
        expect(balance).to.equal(BigNumber.from(0));

        const uri = await proof.uri(releaseID);
        expect(uri).to.equal(`https://gateway.valist.io`);
      });

    it("Should mint to multiple contributors", async function() {
      this.timeout(1000000);
      const valist = await deployValist();
      const proof = await deployProofOfContribution(valist.address);
      const members = await getAddresses();
      const signers = await ethers.getSigners();

      
  
      const createTeamTx = await valist.createTeam("acme", metaURI, members);
      await createTeamTx.wait();
  
      const createProjectTx = await valist.createProject("acme", "bin", metaURI, members);
      await createProjectTx.wait();
  
      const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", metaURI);
      await createReleaseTx.wait();
  
      for (let i = 0; i < signers.length; i++) {
        const approveReleaseTx = await valist.connect(signers[i]).approveRelease("acme", "bin", "0.0.1");
        await approveReleaseTx.wait();  
      }
  
      const page1 = await valist.getReleaseApprovers("acme", "bin", "0.0.1", 0, 10);
      expect(page1).to.have.ordered.members(members.slice(0, 10));
  
      const page2 = await valist.getReleaseApprovers("acme", "bin", "0.0.1", 1, 10);
      expect(page2).to.have.ordered.members(members.slice(10, 20));

      const contributors = [...page1, ...page2];

      const mintContributionTx = await proof.mintBatch("acme", "bin", "0.0.1", contributors);
      await mintContributionTx.wait();

      const teamID = await valist.getTeamID("acme");
      const projectID = await valist.getProjectID(teamID, "bin");
      const releaseID = await valist.getReleaseID(projectID, "0.0.1");
      
      const balanceBatch = await proof.balanceOfBatch(contributors, Array(contributors.length).fill(releaseID));
      expect(balanceBatch).to.deep.equal(Array(contributors.length).fill(BigNumber.from(1)));

      const uri = await proof.uri(releaseID);
      expect(uri).to.equal(`https://gateway.valist.io${metaURI}`);
    });
  });
  