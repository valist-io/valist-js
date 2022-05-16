import Publish from '../../src/commands/publish';
import { ethers } from 'ethers';
import { expect } from 'chai';
import { contracts, create, AccountMeta, ProjectMeta, ReleaseMeta } from '@valist/sdk';

const ganache = require("ganache");
const web3 = ganache.provider({ wallet: { deterministic: true } });

const provider = new ethers.providers.Web3Provider(web3);
const signer = provider.getSigner();

const Registry = new ethers.ContractFactory(contracts.registryABI, contracts.registryBytecode, signer);
const License = new ethers.ContractFactory(contracts.licenseABI, contracts.licenseBytecode, signer);

describe('publish', () => {
  it('should create a release', async function() {
    const registry = await Registry.deploy(ethers.constants.AddressZero);
    await registry.deployed();

    const license = await License.deploy(registry.address);
    await license.deployed();

    const valist = await create(provider, { metaTx: false });
    const address = await signer.getAddress();
    const members = [address];

    const account = new AccountMeta();
    account.name = 'valist';
    account.description = 'Web3 digital distribution';
    account.external_url = 'https://valist.io';

    const project = new ProjectMeta();
    project.name = 'cli';
    project.description = 'Valist CLI';
    project.external_url = 'https://github.com/valist-io/valist-js';

    const accountID = valist.generateID(1337, 'valist');
    const projectID = valist.generateID(accountID, 'cli');
    const releaseID = valist.generateID(projectID, 'v0.0.1');

    const createAccountTx = await valist.createAccount('valist', account, members);
    await createAccountTx.wait();

    const createProjectTx = await valist.createProject(accountID, 'cli', project, members);
    await createProjectTx.wait();

    Publish.provider = provider;

    await Publish.run([
      'valist/cli/v0.0.1', 
      'README.md',
      '--private-key=4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
      '--no-meta-tx'
    ]);

    const releaseExists = await valist.releaseExists(releaseID);
    expect(releaseExists).to.be.true;
  });
});
