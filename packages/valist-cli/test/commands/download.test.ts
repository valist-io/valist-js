import Download from '../../src/commands/download';
import { ethers } from 'ethers';
import { expect } from 'chai';
import { contracts, create, AccountMeta, ProjectMeta, ReleaseMeta } from '@valist/sdk';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';

const ganache = require("ganache");
const web3 = ganache.provider({ wallet: { deterministic: true } });

const provider = new ethers.providers.Web3Provider(web3);
const signer = provider.getSigner();

const Registry = new ethers.ContractFactory(contracts.registryABI, contracts.registryBytecode, signer);
const License = new ethers.ContractFactory(contracts.licenseABI, contracts.licenseBytecode, signer);

describe('download', () => {
	it('should download a release', async function() {
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
    project.description = 'Valist Typescript SDK';
    project.external_url = 'https://github.com/valist-io/valist-js';

    const release = new ReleaseMeta();
    release.name = 'v0.0.1';
    release.description = 'Release v0.0.1';
    release.external_url = await valist.writeJSON('{}');

    const accountID = valist.generateID(1337, 'valist');
    const projectID = valist.generateID(accountID, 'cli');
    const releaseID = valist.generateID(projectID, 'v0.0.1');

    const createAccountTx = await valist.createAccount('valist', account, members);
    await createAccountTx.wait();

    const createProjectTx = await valist.createProject(accountID, 'cli', project, members);
    await createProjectTx.wait();

    const createReleaseTx = await valist.createRelease(projectID, 'v0.0.1', release);
    await createProjectTx.wait();

    const tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'valist-test-'));
    
    Download.provider = provider;
    await Download.run(['valist/cli/v0.0.1', tmp]);

    try {
      await fs.promises.stat(path.join(tmp, 'cli.tar'));  
    } catch(err: any) {
      expect.fail('file does not exist');      
    }
  });
});