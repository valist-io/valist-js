import { Client, Contract, Storage, Team, Project, Release, Artifact } from '../src/index';
import { abi, bytecode } from '../src/contract/abis/Valist.json';
import * as IPFS from 'ipfs-core';
import * as types from 'ipfs-core-types';
import { ethers } from 'ethers';
import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';

const ganache = require("ganache");
const provider = new ethers.providers.Web3Provider(ganache.provider());
const signer = provider.getSigner();
const factory = new ethers.ContractFactory(abi, bytecode, signer);

describe('valist client', async () => {
	let ipfs: types.IPFS;

	before('setup', async () => {
		ipfs = await IPFS.create();
	});

	after('tear down', async () => {
		await ipfs.stop();
	});

	it('should work', async () => {
		const deploy = await factory.deploy(ethers.constants.AddressZero);
		await deploy.deployed();

		const storage = new Storage.IPFS(ipfs);
		const contract = new Contract.EVM(deploy.address, signer);
		const valist = new Client(contract, storage);

		const address = await signer.getAddress();
		const members = [address];

		const team = new Team();
		team.name = 'valist';
		team.description = 'Web3 digital distribution';
		team.homepage = 'https://valist.io';

		const project = new Project();
		project.name = 'sdk';
		project.description = 'Valist Typescript SDK';
		project.homepage = 'https://docs.valist.io';
		project.repository = 'https://github.com/valist-io/valist-js';

		const artifact = new Artifact();
		artifact.provider = 'Qm123';

		const release = new Release();
		release.name = 'sdk@v0.5.0';
		release.version = 'v0.5.0';
		release.artifacts = {
			'package.json': artifact
		};

		await valist.createTeam('valist', team, members);
		await valist.createProject('valist', 'sdk', project, members);
		await valist.createRelease('valist', 'sdk', 'v0.5.0', release);

		const otherTeam = await valist.getTeam('valist');
		expect(otherTeam).to.deep.equal(team);

		const otherProject = await valist.getProject('valist', 'sdk');
		expect(otherProject).to.deep.equal(project);

		const otherRelease = await valist.getRelease('valist', 'sdk', 'v0.5.0');
		expect(otherRelease).to.deep.equal(release);
	});
});
