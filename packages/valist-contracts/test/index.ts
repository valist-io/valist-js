import { expect } from "chai";
import { ethers } from "hardhat";

describe("createTeam", () => {
  it("Should emit TeamCreated", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    await expect(valist.createTeam("acme", "Qm", members))
      .to.emit(valist, 'TeamCreated');
  });

  it("Should fail with claimed name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.createTeam("acme", "Qm", members))
      .to.be.revertedWith('err-name-claimed');
  });

  it("Should fail with empty members", async function() {
    const valist = await deployValist();

    await expect(valist.createTeam("acme", "Qm", []))
      .to.be.revertedWith('err-empty-members');
  });

  it("Should fail with empty name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    await expect(valist.createTeam("", "Qm", members))
      .to.be.revertedWith('err-empty-name');
  });

  it("Should fail with empty meta", async function() {
    const valist = await deployValist();
    const members = await getAddresses();
    
    await expect(valist.createTeam("acme", "", members))
      .to.be.revertedWith('err-empty-meta');
  });
});

describe("createProject", () => {
  it("Should emit ProjectCreated", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.createProject("acme", "bin", "Qm", members))
      .to.emit(valist, 'ProjectCreated');
  });

  it("Should succeed with no members", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.createProject("acme", "bin", "Qm", []))
      .to.emit(valist, 'ProjectCreated');
  });

  it("Should fail with claimed name", async function(){
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", []);
    await createProjectTx.wait();

    await expect(valist.createProject("acme", "bin", "Qm", []))
      .to.be.revertedWith('err-name-claimed');
  });

  it("Should fail with no team member", async function(){
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(1));
    await createTeamTx.wait();

    await expect(valist.createProject("acme", "bin", "Qm", []))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty team name", async function(){
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.createProject("", "bin", "Qm", []))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty project name", async function(){
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.createProject("acme", "", "Qm", []))
      .to.be.revertedWith('err-empty-name');
  });

  it("Should fail with empty meta", async function(){
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.createProject("acme", "bin", "", []))
      .to.be.revertedWith('err-empty-meta');
  });
});

describe("createRelease", () => {
  it("Should emit ReleaseCreated", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.createRelease("acme", "bin", "0.0.1", "Qm"))
      .to.emit(valist, 'ReleaseCreated');
  });

  it("Should fail with no project member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members.slice(1));
    await createProjectTx.wait();

    await expect(valist.createRelease("acme", "bin", "0.0.1", "Qm"))
      .to.be.revertedWith('err-proj-member');
  });

  it("Should fail with claimed name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.createRelease("acme", "bin", "0.0.1", "Qm"))
      .to.be.revertedWith('err-name-claimed');
  });

  it("Should fail with empty name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.createRelease("acme", "bin", "", "Qm"))
      .to.be.revertedWith('err-empty-name');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.createRelease("", "bin", "0.0.1", "Qm"))
      .to.be.revertedWith('err-proj-member');
  });

  it("Should fail with empty project name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.createRelease("acme", "", "0.0.1", "Qm"))
      .to.be.revertedWith('err-proj-member');
  });

  it("Should fail with empty meta", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.createRelease("acme", "bin", "0.0.1", ""))
      .to.be.revertedWith('err-empty-meta');
  });
});

describe("approveRelease", () => {
  it("Should emit ReleaseApproved", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.approveRelease("acme", "bin", "0.0.1"))
      .to.emit(valist, 'ReleaseApproved');
  });

  it("Should fail with empty name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.approveRelease("acme", "bin", ""))
      .to.be.revertedWith('err-release-not-exist');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.approveRelease("", "bin", "0.0.1"))
      .to.be.revertedWith('err-release-not-exist');
  });

  it("Should fail with empty project name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.approveRelease("acme", "", "0.0.1"))
      .to.be.revertedWith('err-release-not-exist');
  });
});

describe("rejectRelease", () => {
  it("Should emit ReleaseRejected", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.rejectRelease("acme", "bin", "0.0.1"))
      .to.emit(valist, 'ReleaseRejected');
  });

  it("Should fail with empty name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.rejectRelease("acme", "bin", ""))
      .to.be.revertedWith('err-release-not-exist');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.rejectRelease("", "bin", "0.0.1"))
      .to.be.revertedWith('err-release-not-exist');
  });

  it("Should fail with empty project name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm");
    await createReleaseTx.wait();

    await expect(valist.rejectRelease("acme", "", "0.0.1"))
      .to.be.revertedWith('err-release-not-exist');
  });
});

describe("addTeamMember", () => {
  it("Should emit TeamMemberAdded", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(0, 1));
    await createTeamTx.wait();

    await expect(valist.addTeamMember("acme", members[1]))
      .to.emit(valist, "TeamMemberAdded");
  });

  it("Should fail with duplicate member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.addTeamMember("acme", members[1]))
      .to.be.revertedWith('err-member-exist');
  });

  it("Should fail with no team member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(1));
    await createTeamTx.wait();

    await expect(valist.addTeamMember("acme", members[0]))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.addTeamMember("", members[1]))
      .to.be.revertedWith('err-team-member');
  });
});

describe("removeTeamMember", () => {
  it("Should emit TeamMemberRemoved", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.removeTeamMember("acme", members[1]))
      .to.emit(valist, "TeamMemberRemoved");
  });

  it("Should fail with no team member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(1));
    await createTeamTx.wait();

    await expect(valist.removeTeamMember("acme", members[0]))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with non existant member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(0, 3));
    await createTeamTx.wait();

    await expect(valist.removeTeamMember("acme", members[5]))
      .to.be.revertedWith('err-member-not-exist');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.removeTeamMember("", members[1]))
      .to.be.revertedWith('err-team-member');
  });
});

describe("addProjectMember", () => {
  it("Should emit ProjectMemberAdded", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", []);
    await createProjectTx.wait();

    await expect(valist.addProjectMember("acme", "bin", members[0]))
      .to.emit(valist, "ProjectMemberAdded");
  });

  it("Should fail with duplicate member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.addProjectMember("acme", "bin", members[0]))
      .to.be.revertedWith('err-member-exist');
  });

  it("Should fail with no team member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();
    const signers = await ethers.getSigners();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(0, 1));
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", []);
    await createProjectTx.wait();

    await expect(valist.connect(signers[1]).addProjectMember("acme", "bin", members[0]))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", []);
    await createProjectTx.wait();

    await expect(valist.addProjectMember("", "bin", members[0]))
      .to.be.revertedWith('err-proj-not-exist');
  });

  it("Should fail with empty project name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", []);
    await createProjectTx.wait();

    await expect(valist.addProjectMember("acme", "", members[0]))
      .to.be.revertedWith('err-proj-not-exist');
  });
});

describe("removeProjectMember", () => {
  it("Should emit ProjectMemberRemoved", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.removeProjectMember("acme", "bin", members[0]))
      .to.emit(valist, "ProjectMemberRemoved");
  });

  it("Should fail with non existant member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members.slice(0, 3));
    await createProjectTx.wait();

    await expect(valist.removeProjectMember("acme", "bin", members[5]))
      .to.be.revertedWith('err-member-not-exist');
  });

  it("Should fail with no team member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();
    const signers = await ethers.getSigners();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(0, 1));
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.connect(signers[1]).removeProjectMember("acme", "bin", members[0]))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.removeProjectMember("", "bin", members[0]))
      .to.be.revertedWith('err-proj-not-exist');
  });

  it("Should fail with empty project name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.removeProjectMember("acme", "", members[0]))
      .to.be.revertedWith('err-proj-not-exist');
  });
});

describe("setTeamMetaCID", () => {
  it("Should emit TeamUpdated", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.setTeamMetaCID("acme", "baf"))
      .to.emit(valist, "TeamUpdated");
  });

  it("Should fail with no team member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(1));
    await createTeamTx.wait();

    await expect(valist.setTeamMetaCID("acme", "baf"))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.setTeamMetaCID("", "baf"))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty meta", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    await expect(valist.setTeamMetaCID("acme", ""))
      .to.be.revertedWith('err-empty-meta');
  });
});

describe("setProjectMetaCID", () => {
  it("Should emit ProjectUpdated", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.setProjectMetaCID("acme", "bin", "baf"))
      .to.emit(valist, "ProjectUpdated");
  });

  it("Should fail with no team member", async function() {
    const valist = await deployValist();
    const members = await getAddresses();
    const signers = await ethers.getSigners();

    const createTeamTx = await valist.createTeam("acme", "Qm", members.slice(0, 1));
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.connect(signers[1]).setProjectMetaCID("acme", "bin", "baf"))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty team name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.setProjectMetaCID("", "bin", "baf"))
      .to.be.revertedWith('err-team-member');
  });

  it("Should fail with empty project name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.setProjectMetaCID("acme", "", "baf"))
      .to.be.revertedWith('err-proj-not-exist');
  });

  it("Should fail with empty meta", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    await expect(valist.setProjectMetaCID("acme", "bin", ""))
      .to.be.revertedWith('err-empty-meta');
  });
});

describe("getTeamMetaCID", () => {
  it("Should return team meta", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const metaCID = await valist.getTeamMetaCID("acme");
    expect(metaCID).to.equal("Qm");
  });

  it("Should fail with non existant team", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    await expect(valist.getTeamMetaCID("acme"))
      .to.be.revertedWith('err-team-not-exist');
  });
});

describe("getProjectMetaCID", () => {
  it("Should return project meta", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm1", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm2", []);
    await createProjectTx.wait();

    const metaCID = await valist.getProjectMetaCID("acme", "bin");
    expect(metaCID).to.equal("Qm2");
  });

  it("Should fail with non existant project", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    await expect(valist.getProjectMetaCID("acme", "bin"))
      .to.be.revertedWith('err-proj-not-exist');
  });
});

describe("getReleaseMetaCID", () => {
  it("Should return release meta", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm1", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm2", members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease("acme", "bin", "0.0.1", "Qm3");
    await createReleaseTx.wait();

    const metaCID = await valist.getReleaseMetaCID("acme", "bin", "0.0.1");
    expect(metaCID).to.equal("Qm3");
  });

  it("Should fail with non existant release", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    await expect(valist.getReleaseMetaCID("acme", "bin", "0.0.1"))
      .to.be.revertedWith('err-release-not-exist');
  });
});

describe("getLatestReleaseName", () => {
  it("Should return latest release name", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm1", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm2", members);
    await createProjectTx.wait();

    for (let i = 0; i < 6; i++) {
      const createReleaseTx = await valist.createRelease("acme", "bin", `0.0.${i}`, "Qm");
      await createReleaseTx.wait();  
    }

    const name = await valist.getLatestReleaseName("acme", "bin");
    expect(name).to.equal("0.0.5");
  });

  it("Should fail with non existant release", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    await expect(valist.getLatestReleaseName("acme", "bin"))
      .to.be.revertedWith('err-proj-not-exist');
  });
});

describe("getTeamNames", () => {
  it("Should return team names", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    for (let i = 0; i < 4; i++) {
      const createTeamTx = await valist.createTeam(`acme-${i}`, "Qm", members);
      await createTeamTx.wait();
    }

    const page1 = await valist.getTeamNames(0, 2);
    expect(page1).to.have.ordered.members(["acme-0", "acme-1"]);

    const page2 = await valist.getTeamNames(1, 2);
    expect(page2).to.have.ordered.members(["acme-2", "acme-3"]);
  });
});

describe("getProjectNames", () => {
  it("Should return project names", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    for (let i = 0; i < 4; i++) {
      const createProjectTx = await valist.createProject("acme", `bin-${i}`, "Qm", []);
      await createProjectTx.wait();
    }

    const page1 = await valist.getProjectNames("acme", 0, 2);
    expect(page1).to.have.ordered.members(["bin-0", "bin-1"]);

    const page2 = await valist.getProjectNames("acme", 1, 2);
    expect(page2).to.have.ordered.members(["bin-2", "bin-3"]);
  });
});

describe("getReleaseNames", () => {
  it("Should return release names", async function() {
    const valist = await deployValist();
    const members = await getAddresses();

    const createTeamTx = await valist.createTeam("acme", "Qm", members);
    await createTeamTx.wait();

    const createProjectTx = await valist.createProject("acme", "bin", "Qm", members);
    await createProjectTx.wait();

    for (let i = 0; i < 4; i++) {
      const createReleaseTx = await valist.createRelease("acme", "bin", `0.0.${i}`, "Qm");
      await createReleaseTx.wait();
    }

    const page1 = await valist.getReleaseNames("acme", "bin", 0, 2);
    expect(page1).to.have.ordered.members(["0.0.0", "0.0.1"]);

    const page2 = await valist.getReleaseNames("acme", "bin", 1, 2);
    expect(page2).to.have.ordered.members(["0.0.2", "0.0.3"]);
  });
});

describe("getReleaseApprovals", () => {
  it("Should return approval addresses", async function() {
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

describe("getReleaseRejections", () => {
  it("Should return rejection addresses", async function() {
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
      const rejectReleaseTx = await valist.connect(signers[i]).rejectRelease("acme", "bin", "0.0.1");
      await rejectReleaseTx.wait();  
    }

    const page1 = await valist.getReleaseRejectors("acme", "bin", "0.0.1", 0, 10);
    expect(page1).to.have.ordered.members(members.slice(0, 10));

    const page2 = await valist.getReleaseRejectors("acme", "bin", "0.0.1", 1, 10);
    expect(page2).to.have.ordered.members(members.slice(10, 20));
  });
});

async function deployValist() {
  const Valist = await ethers.getContractFactory("Valist");
  const valist = await Valist.deploy("0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b");
  
  await valist.deployed();
  return valist;
}

async function getAddresses() {
  const signers = await ethers.getSigners();
  return signers.map((acct) => acct.address);
}
