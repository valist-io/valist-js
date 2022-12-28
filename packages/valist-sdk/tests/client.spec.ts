import { ethers } from 'ethers';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { create as createIPFS } from 'ipfs-http-client';

import {
	Client,
	AccountMeta,
	ProjectMeta,
	ReleaseMeta,
	generateID,
} from '../src/index';
import * as contracts from '../src/contracts';

const ganache = require("ganache");
const provider = new ethers.providers.Web3Provider(ganache.provider());
const signer = provider.getSigner();

const Registry = new ethers.ContractFactory(contracts.registryABI, contracts.registryBytecode, signer);
const License = new ethers.ContractFactory(contracts.licenseABI, contracts.licenseBytecode, signer);

async function createClient(registry: ethers.Contract, license: ethers.Contract) {
	const subgraphAddress = 'https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai';
	const ipfsGateway = 'https://gateway.valist.io';
	// @ts-expect-error
	const ipfs = createIPFS('https://pin-infura.valist.io');
	const valist = new Client(registry, license, ipfs, ipfsGateway, subgraphAddress, provider, false);
	return valist;
}

describe('valist client', async function () {
	const accountID = generateID(1337, 'valist');
	const projectID = generateID(accountID, 'sdk');
	const releaseID = generateID(projectID, 'v0.5.0');
	let registry: ethers.Contract, license: ethers.Contract;
	let valist: Client;
	let address: string;

	before(async () => {
		registry = await Registry.deploy(ethers.constants.AddressZero);
		await registry.deployed();

		license = await License.deploy(registry.address);
		await license.deployed();

		valist = await createClient(registry, license);
		address = await signer.getAddress();
	});

	describe('list data', async () => {
		const address = await signer.getAddress();
		const members = [address];

		const account = new AccountMeta();
		account.image = 'https://gateway.valist.io/ipfs/Qm456';
		account.name = 'valist';
		account.description = 'Web3 digital distribution';
		account.external_url = 'https://valist.io';

		it('should create account', async () => {
			const createAccountTx = await valist.createAccount('valist', account, members);
			await createAccountTx.wait();

			const otherAccount = await valist.getAccountMeta(accountID);
			expect(otherAccount).to.deep.equal(account);
		});

		it('should create project', async () => {
			const project = new ProjectMeta();
			project.image = 'https://gateway.valist.io/ipfs/Qm456';
			project.name = 'sdk';
			project.description = 'Valist Typescript SDK';
			project.external_url = 'https://github.com/valist-io/valist-js';

			const createProjectTx = await valist.createProject(accountID, 'sdk', project, members);
			await createProjectTx.wait();

			const otherProject = await valist.getProjectMeta(projectID);
			expect(otherProject).to.deep.equal(project);
		});

		it('should publish release', async () => {
			const release = new ReleaseMeta();
			release.image = 'https://gateway.valist.io/ipfs/Qm456';
			release.name = 'sdk@v0.5.0';
			release.description = 'Release v0.5.0';
			release.external_url = 'https://gateway.valist.io/ipfs/Qm123';

			const createReleaseTx = await valist.createRelease(projectID, 'v0.5.0', release);
			await createReleaseTx.wait();

			const otherRelease = await valist.getReleaseMeta(releaseID);
			expect(otherRelease).to.deep.equal(release);
		});
	});

	// describe('list data', async () => {
	// 	it('list', async () => {
	// 		const accounts = await valist.listAccounts();
	// 		expect(accounts).to.be.an('array');

	// 		const projects = await valist.listProjects();
	// 		expect(projects).to.be.an('array');

	// 		const releases = await valist.listReleases();
	// 		expect(releases).to.be.an('array');

	// 		const accountProjects = await valist.listAccountProjects('0x936b6ef8e862c038230e8b4d88e776d01dce42e7f15affd8d80c58eedfc4edf9');
	// 		expect(accountProjects).to.be.an('array');

	// 		const projectReleases = await valist.listProjectReleases('0x9c7907db127f86ca8a18110f1fc7b4858a6cbf58507be326c860e88e4600bd09');
	// 		expect(projectReleases).to.be.an('array');

	// 		const userAccounts = await valist.listUserAccounts('0xd50daa26f556538562ba308dc0ed45cface885fe');
	// 		expect(userAccounts).to.be.an('array');

	// 		const userProjects = await valist.listUserProjects('0x2917104d828ccd4cbdf4177a2e4c8a754a9e166c');
	// 		expect(userProjects).to.be.an('array');
	// 	});
	// });
});

// describe('valist uploadRelease', async function () {
// 	const valist = await create(provider, { metaTx: false });
// 	const accountName = 'testAccount';
// 	const projectName = 'testProject';
// 	const releaseName = '0.0.1';

// 	const { chainId } = await provider.getNetwork();
// 	const accountID = valist.generateID(chainId, accountName);
// 	const projectID = valist.generateID(accountID, projectName);
// 	const releaseID = valist.generateID(projectID, releaseName);

// 	it('should uploadRelease', async () => {
// 		let config = new ReleaseConfig(accountName, projectName, releaseName);
// 		const release = await valist.uploadRelease(config);
// 		const tx = await valist.createRelease(projectID, config.release, release);
// 	});
// });