/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

async function deploy() {
  const Valist = await ethers.getContractFactory("Valist");
  const valist = await Valist.deploy();
  await valist.deployed();
  return valist;
}

describe("Valist", () => {
  it("Should create a team", async function() {
    const valist = await deploy();

    const accounts = await ethers.getSigners();
    const members = accounts.map(async (acct) => await acct.getAddress());

    await expect(valist.createTeam("acme", "Qm", members))
      .to.emit(valist, 'TeamCreated');
  });

  it("Should fail to create a team with claimed name", async function() {
    const valist = await deploy();

    const accounts = await ethers.getSigners();
    const members = accounts.map(async (acct) => await acct.getAddress());

    await valist.createTeam("acme", "Qm", members)
    await expect(valist.createTeam("acme", "Qm", members))
      .to.be.revertedWith('err-name-claimed');
  });

  it("Should fail to create a team with no members", async function() {
    const valist = await deploy();

    await expect(valist.createTeam("acme", "Qm", []))
      .to.be.revertedWith('err-empty-members');
  });

  it("Should fail to create a team with no name", async function() {
    const valist = await deploy();

    const accounts = await ethers.getSigners();
    const members = accounts.map(async (acct) => await acct.getAddress());

    await expect(valist.createTeam("", "Qm", members))
      .to.be.revertedWith('err-empty-name');
  });

  it("Should fail to create a team with no meta", async function() {
    const valist = await deploy();

    const accounts = await ethers.getSigners();
    const members = accounts.map(async (acct) => await acct.getAddress());
    
    await expect(valist.createTeam("acme", "", members))
      .to.be.revertedWith('err-empty-meta');
  });
});
