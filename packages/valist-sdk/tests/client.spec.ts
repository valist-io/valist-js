import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import { Web3Storage } from 'web3.storage';

import { 
	Client, 
	AccountMeta, 
	ProjectMeta, 
	ReleaseMeta, 
	generateID 
} from '../src/index';
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
		const ipfsGateway = 'https://gateway.valist.io';
		const subgraphAddress = 'https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai';

		const w3sClient = new Web3Storage({ token: 'VALIST_PUBLIC_TOKEN', endpoint: new URL('https://pin-w3s.valist.workers.dev')});

		const valist = new Client(registry, license, w3sClient, ipfs, ipfsGateway, subgraphAddress);

		console.log(await valist.writeJSON(JSON.stringify({"test":"test"})));

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

		const accounts = await valist.listAccounts();
		expect(accounts).to.be.an('array');

		const projects = await valist.listProjects();
		expect(projects).to.be.an('array');

		const releases = await valist.listReleases();
		expect(releases).to.be.an('array');

		const accountProjects = await valist.listAccountProjects('0x936b6ef8e862c038230e8b4d88e776d01dce42e7f15affd8d80c58eedfc4edf9');
		expect(accountProjects).to.be.an('array');

		const projectReleases = await valist.listProjectReleases('0x9c7907db127f86ca8a18110f1fc7b4858a6cbf58507be326c860e88e4600bd09');
		expect(projectReleases).to.be.an('array');

		const userAccounts = await valist.listUserAccounts('0xd50daa26f556538562ba308dc0ed45cface885fe');
		expect(userAccounts).to.be.an('array');

		const userProjects = await valist.listUserProjects('0x2917104d828ccd4cbdf4177a2e4c8a754a9e166c');
		expect(userProjects).to.be.an('array');
	});
});
