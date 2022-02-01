import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

import { getAddresses, deployValist } from "..";

export async function deploySoftwareLicense(registryAddress: string) {
    const LicenseFactory = await ethers.getContractFactory("SoftwareLicense");
    const License = await LicenseFactory.deploy(registryAddress, "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b");
    
    await License.deployed();
    return License;
  }

// {
//     "name": "Software License",
//     "symbol": "LICENSE",
//     "description": "Valist Software License NFT",
//     "image": "https://gateway.valist.io/ipfs/QmfPeC65TKPbA3dxE314Boh82LX5NpkcrPXonCxUuKh6vr"
// }
const metaURI = "/ipfs/QmWndA8EP3VB7qsx1sgQ97tHhJM6PXv8zQj79fqHNoEUUG";

describe("Software License", () => {
    it("Should mint when payment fulfilled", async function() {
        const valist = await deployValist();
        const license = await deploySoftwareLicense(valist.address);

        const signers = await ethers.getSigners();
    
        const createTeamTx = await valist.createTeam("acme", metaURI, signers[1].address, [signers[0].address]);
        await createTeamTx.wait();
    
        const createProjectTx = await valist.createProject("acme", "bin", metaURI, []);
        await createProjectTx.wait();
    
        const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.2", metaURI);
        await createReleaseTx.wait();
  
        const createLicenseTx = await license.createLicense(
          "acme",
          "bin",
          "2022 Edition",
          metaURI,
          ethers.utils.parseEther("1.0"),
        );
        await createLicenseTx.wait();
  
        const teamID = await valist.getTeamID("acme");
        const projectID = await valist.getProjectID(teamID, "bin");
        const licenseID = await license.getLicenseID(projectID, "2022 Edition");

        const mintLicenseTx = await license.mintLicense(
          "acme",
          "bin",
          "2022 Edition",
          signers[0].address,
          {
            value: ethers.utils.parseEther("1.0"),
          },
        );
        await mintLicenseTx.wait();
        
        const balance = await license.balanceOf(signers[0].address, licenseID);
        expect(balance).to.equal(BigNumber.from(1));

        const uri = await license.uri(licenseID);
        expect(uri).to.equal(`https://gateway.valist.io${metaURI}`);

        const releaseURI = await license.getReleaseMetaURI("acme", "bin", "0.0.2");
        expect(releaseURI).to.equal(`https://gateway.valist.io${metaURI}`);

        expect(await signers[1].getBalance()).to.equal(BigNumber.from("10000999649878995889850"));
      });

      it("Should fail to create license when project does not exist", async function() {
        const valist = await deployValist();
        const license = await deploySoftwareLicense(valist.address);

        const metaURI = "/ipfs/QmVteGgoFEZtnY2CCpt4rRdTSFkQucqo5wPibD5xJXoiQJ";

        const signers = await ethers.getSigners();
    
        const createTeamTx = await valist.createTeam("acme", metaURI, signers[0].address, [signers[0].address]);
        await createTeamTx.wait();
    
        const createProjectTx = await valist.createProject("acme", "bin", metaURI, []);
        await createProjectTx.wait();

        expect(license.createLicense(
          "acme",
          "otherproject",
          "2022 Edition",
          metaURI,
          ethers.utils.parseEther("1.0"),
        ))
          .to.be.revertedWith('err-proj-not-exist');
  
        const teamID = await valist.getTeamID("acme");
        const projectID = await valist.getProjectID(teamID, "otherproject");
        const licenseID = await license.getLicenseID(projectID, "2022 Edition");
  
        await expect(license.mintLicense("acme", "otherproject", "0.0.1", signers[0].address))
            .to.be.revertedWith('err-license-not-exist');
        
        const balance = await license.balanceOf(signers[0].address, licenseID);
        expect(balance).to.equal(BigNumber.from(0));

        const uri = await license.uri(licenseID);
        expect(uri).to.equal(`https://gateway.valist.io`);
      });

      it("Should fail to create license when not a team member", async function() {
        const valist = await deployValist();
        const license = await deploySoftwareLicense(valist.address);

        const metaURI = "/ipfs/QmVteGgoFEZtnY2CCpt4rRdTSFkQucqo5wPibD5xJXoiQJ";

        const signers = await ethers.getSigners();
    
        const createTeamTx = await valist.createTeam("acme", metaURI, signers[0].address, [signers[0].address]);
        await createTeamTx.wait();
    
        const createProjectTx = await valist.createProject("acme", "bin", metaURI, []);
        await createProjectTx.wait();

        expect(
          license
          .connect(signers[1])
          .createLicense(
          "acme",
          "bin",
          "2022 Edition",
          metaURI,
          ethers.utils.parseEther("1.0"),
        ))
          .to.be.revertedWith('err-team-member');
  
        const teamID = await valist.getTeamID("acme");
        const projectID = await valist.getProjectID(teamID, "bin");
        const licenseID = await license.getLicenseID(projectID, "2022 Edition");
  
        await expect(license.mintLicense("acme", "bin", "0.0.1", signers[0].address))
            .to.be.revertedWith('err-license-not-exist');
        
        const balance = await license.balanceOf(signers[0].address, licenseID);
        expect(balance).to.equal(BigNumber.from(0));

        const uri = await license.uri(licenseID);
        expect(uri).to.equal(`https://gateway.valist.io`);
      });
  });
  