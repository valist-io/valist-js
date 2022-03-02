import { Client, Contract, Storage, TeamMeta, ProjectMeta, ReleaseMeta, ArtifactMeta, LicenseMeta } from '../src/index';
import * as IPFS from 'ipfs-core';
import * as types from 'ipfs-core-types';
import { ethers } from 'ethers';
import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';

import * as valist_contract from '../src/contract/artifacts/Valist.sol/Valist.json';
import * as license_contract from '../src/contract/artifacts/ERC-1155/SoftwareLicense.sol/SoftwareLicense.json';

const ganache = require("ganache");
const provider = new ethers.providers.Web3Provider(ganache.provider());
const signer = provider.getSigner();

const valist_factory = new ethers.ContractFactory(valist_contract.abi, valist_contract.bytecode, signer);
const license_factory = new ethers.ContractFactory(license_contract.abi, license_contract.bytecode, signer);

describe('valist client', async function() {
	this.timeout(10000);
	let ipfs: types.IPFS;

	before('setup', async () => {
		ipfs = await IPFS.create();
	});

	after('tear down', async () => {
		await ipfs.stop();
	});

	it('should work', async () => {
		const valist_deploy = await valist_factory.deploy(ethers.constants.AddressZero);
		await valist_deploy.deployed();

    const license_deploy = await license_factory.deploy(valist_deploy.address, ethers.constants.AddressZero);
    await license_deploy.deployed();

    const options: Contract.EVM_Options = {
      valistAddress: valist_deploy.address,
      licenseAddress: license_deploy.address,
      metaTx: false,
    };

		const storage = new Storage.IPFS(ipfs);
		const contract = new Contract.EVM(options, provider);
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

		const license = new LicenseMeta();
		license.image = 'https://gateway.valist.io/ipfs/Qm789';
		license.name = 'Valist Pro';
		license.description = 'Access pro tier features on Valist';
		license.external_url = 'https://valist.io/pro';

		await valist.createTeam('valist', team, members[0], members);
		await valist.createProject('valist', 'sdk', project, members);
		await valist.createRelease('valist', 'sdk', 'v0.5.0', release);
		await valist.createLicense('valist', 'sdk', 'pro', license, 1000);

		const otherTeam = await valist.getTeamMeta('valist');
		expect(otherTeam).to.deep.equal(team);

		const otherProject = await valist.getProjectMeta('valist', 'sdk');
		expect(otherProject).to.deep.equal(project);

		const otherRelease = await valist.getReleaseMeta('valist', 'sdk', 'v0.5.0');
		expect(otherRelease).to.deep.equal(release);

		const beneficiary = await valist.getTeamBeneficiary('valist');
		expect(beneficiary).to.equal(members[0]);

		const newBeneficiary = '0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b';
		await valist.setTeamBeneficiary('valist', newBeneficiary);

		const otherBeneficiary = await valist.getTeamBeneficiary('valist');
		expect(otherBeneficiary).to.equal(newBeneficiary);

		const otherLicense = await valist.getLicenseMeta('valist', 'sdk', 'pro');
		expect(otherLicense).to.deep.equal(license);

		const licensePrice = await valist.contract.getLicensePrice('valist', 'sdk', 'pro');
		expect(licensePrice.toString()).to.equal('1000');

		await valist.contract.mintLicense('valist', 'sdk', 'pro', address);
	});
});
