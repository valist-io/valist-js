import { ContractAPI } from './types';
import { Contract, Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { abi } from '../abis/contracts/Valist.sol/Valist.json';

export class EVM implements ContractAPI {
	contract: Contract;

	constructor(address: string, signerOrProvider: Signer | Provider) {
		this.contract = new Contract(address, abi, signerOrProvider);
	}
	
	async createTeam(teamName: string, metaURI: string, members: string[]): Promise<void> {
		const tx = await this.contract.createTeam(teamName, metaURI, members);
		await tx.wait();
	}
	
	async createProject(teamName: string, projectName: string, metaURI: string, members: string[]): Promise<void> {
		const tx = await this.contract.createProject(teamName, projectName, metaURI, members);
		await tx.wait();
	}
	
	async createRelease(teamName: string, projectName: string, releaseName: string, metaURI: string): Promise<void> {
		const tx = await this.contract.createRelease(teamName, projectName, releaseName, metaURI);
		await tx.wait();
	}
	
	async addTeamMember(teamName: string, address: string): Promise<void> {
		const tx = await this.contract.addTeamMember(teamName, address);
		await tx.wait();
	}
	
	async removeTeamMember(teamName: string, address: string): Promise<void> {
		const tx = await this.contract.removeTeamMember(teamName, address);
		await tx.wait();
	}
	
	async addProjectMember(teamName: string, projectName: string, address: string): Promise<void> {
		const tx = await this.contract.addProjectMember(teamName, projectName, address);
		await tx.wait();
	}
	
	async removeProjectMember(teamName: string, projectName: string, address: string): Promise<void> {
		const tx = await this.contract.removeProjectMember(teamName, projectName, address);
		await tx.wait();
	}
	
	async setTeamMetaURI(teamName: string, metaURI: string): Promise<void> {
		const tx = await this.contract.setTeamMetaURI(teamName, metaURI);
		await tx.wait();
	}
	
	async setProjectMetaURI(teamName: string, projectName: string, metaURI: string): Promise<void> {
		const tx = await this.contract.setProjectMetaURI(teamName, projectName, metaURI);
		await tx.wait();
	}
	
	async approveRelease(teamName: string, projectName: string, releaseName: string): Promise<void> {
		const tx = await this.contract.approveRelease(teamName, projectName, releaseName);
		await tx.wait();
	}
	
	async rejectRelease(teamName: string, projectName: string, releaseName: string): Promise<void> {
		const tx = await this.contract.rejectRelease(teamName, projectName, releaseName);
		await tx.wait();
	}
	
	async getLatestReleaseName(teamName: string, projectName: string): Promise<string> {
		return await this.contract.getLatestRelease(teamName, projectName);
	}
	
	async getTeamMetaURI(teamName: string): Promise<string> {
		return await this.contract.getTeamMetaURI(teamName);
	}
	
	async getProjectMetaURI(teamName: string, projectName: string): Promise<string> {
		return await this.contract.getProjectMetaURI(teamName, projectName);
	}
	
	async getReleaseMetaURI(teamName: string, projectName: string, releaseName: string): Promise<string> {
		return await this.contract.getReleaseMetaURI(teamName, projectName, releaseName);
	}
	
	async getTeamNames(page: number, size: number): Promise<string[]> {
		return await this.contract.getTeamNames(page, size);
	}
	
	async getProjectNames(teamName: string, page: number, size: number): Promise<string[]> {
		return await this.contract.getProjectNames(teamName, page, size);
	}
	
	async getReleaseNames(teamName: string, projectName: string, page: number, size: number): Promise<string[]> {
		return await this.contract.getReleaseNames(teamName, projectName, page, size);
	}
	
	async getTeamMembers(teamName: string, page: number, size: number): Promise<string[]> {
		return await this.contract.getTeamMembers(teamName, page, size);
	}
	
	async getProjectMembers(teamName: string, projectName: string, page: number, size: number): Promise<string[]> {
		return await this.contract.getProjectMembers(teamName, projectName, page, size);
	}
	
	async getReleaseApprovers(teamName: string, projectName: string, releaseName: string, page: number, size: number): Promise<string[]> {
		return await this.contract.getReleaseApprovers(teamName, projectName, releaseName, page, size);
	}
	
	async getReleaseRejectors(teamName: string, projectName: string, releaseName: string, page: number, size: number): Promise<string[]> {
		return await this.contract.getReleaseRejectors(teamName, projectName, releaseName, page, size);
	}
}