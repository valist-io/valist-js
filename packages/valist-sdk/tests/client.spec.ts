import { Client, AccountMeta, ProjectMeta, ReleaseMeta, generateID } from '../src/index';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import * as contracts from '../src/contracts';

const ganache = require("ganache");
const provider = new ethers.providers.Web3Provider(ganache.provider());
const signer = provider.getSigner();

const Registry = new ethers.ContractFactory(contracts.registryABI, contracts.registryBytecode, signer);
const License = new ethers.ContractFactory(contracts.licenseABI, contracts.licenseBytecode, signer);

describe('valist client', async function() {
	it('should work', async () => {
		const registry = await Registry.deploy(ethers.constants.AddressZero);
		await registry.deployed();

		const license = await License.deploy(registry.address);
		await license.deployed();

		const ipfs = create({ url: 'https://pin.valist.io' });
		const valist = new Client(registry, license, ipfs, 'https://gateway-new.valist.io');

		const address = await signer.getAddress();
		const members = [address];

		const account = new AccountMeta();
		account.image = 'https://gateway.valist.io/ipfs/Qm456';
		account.name = 'valist';
		account.description = 'Web3 digital distribution';
		account.external_url = 'https://valist.io';

		const project = new ProjectMeta();
		project.image = 'https://gateway.valist.io/ipfs/Qm456';
		project.name = 'sdk';
		project.description = 'Valist Typescript SDK';
		project.external_url = 'https://github.com/valist-io/valist-js';

		const release = new ReleaseMeta();
		release.image = 'https://gateway.valist.io/ipfs/Qm456';
		release.name = 'sdk@v0.5.0';
		release.description = 'Release v0.5.0';
		release.external_url = 'https://gateway.valist.io/ipfs/Qm123';

		const accountID = generateID(1337, 'valist');
		const projectID = generateID(accountID, 'sdk');
		const releaseID = generateID(projectID, 'v0.5.0');

		const createAccountTx = await valist.createAccount('valist', account, members);
		await createAccountTx.wait();

		const createProjectTx = await valist.createProject(accountID, 'sdk', project, members);
		await createProjectTx.wait();

		const createReleaseTx = await valist.createRelease(projectID, 'v0.5.0', release);
		await createReleaseTx.wait();

		const otherAccount = await valist.getAccountMeta(accountID);
		expect(otherAccount).to.deep.equal(account);

		const otherProject = await valist.getProjectMeta(projectID);
		expect(otherProject).to.deep.equal(project);

		const otherRelease = await valist.getReleaseMeta(releaseID);
		expect(otherRelease).to.deep.equal(release);
	});
});
