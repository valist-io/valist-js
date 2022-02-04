import { Client, Contract, Storage, TeamMeta, ProjectMeta, ReleaseMeta, ArtifactMeta } from '../src/index';
import { abi, bytecode } from '../src/contract/artifacts/Valist.sol/Valist.json';
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

		const team = new TeamMeta();
		team.image = 'https://gateway.valist.io/ipfs/Qm456';
		team.name = 'valist';
		team.description = 'Web3 digital distribution';
		team.external_url = 'https://valist.io';

		const project = new ProjectMeta();
		project.image = 'https://gateway.valist.io/ipfs/Qm456';
		project.name = 'sdk';
		project.description = 'Valist Typescript SDK';
		project.external_url = 'https://github.com/valist-io/valist-js';

		const release = new ReleaseMeta();
		release.image = 'https://gateway.valist.io/ipfs/Qm456';
		release.name = 'sdk@v0.5.0';
		release.description = 'Release v0.5.0';
		release.external_url = 'https://github.com/valist-io/valist/releases/tag/v0.6.3';

		const artifact = new ArtifactMeta();
		artifact.provider = '/ipfs/Qm123';

		release.artifacts = new Map<string, ArtifactMeta>();
		release.artifacts.set('package.json', artifact);

		await valist.createTeam('valist', team, members[0], members);
		await valist.createProject('valist', 'sdk', project, members);
		await valist.createRelease('valist', 'sdk', 'v0.5.0', release);

		const otherTeam = await valist.getTeamMeta('valist');
		expect(otherTeam).to.deep.equal(team);

		let beneficiary = await valist.getTeamBeneficiary('valist');

		const otherProject = await valist.getProjectMeta('valist', 'sdk');
		expect(otherProject).to.deep.equal(project);

		const otherRelease = await valist.getReleaseMeta('valist', 'sdk', 'v0.5.0');
		expect(otherRelease).to.deep.equal(release);

		await valist.setTeamBeneficiary('valist', '0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b');
		beneficiary = await valist.getTeamBeneficiary('valist');
		expect(beneficiary).to.equal('0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b');
	});
});
