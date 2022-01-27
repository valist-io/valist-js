@nearBindgen
export class Team {
	projectNames: Array<string>;
	members: Set<string>;

	constructor(members: Set<string>) {
		this.projectNames = new Array<string>();
		this.members = members;
	}
}

@nearBindgen
export class Project {
	releaseNames: Array<string>;
	members: Set<string>;

	constructor(members: Set<string>) {
		this.releaseNames = new Array<string>();
		this.members = members;
	}
}

@nearBindgen
export class Release {
	approvers: Set<string>;
	rejectors: Set<string>;

	constructor() {
		this.approvers = new Set<string>();
		this.rejectors = new Set<string>();
	}
}