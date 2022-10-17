// Valist Types
export class AccountMeta {
	/** account image */
	public image?: string;
	/** account friendly name. */
	public name?: string;
	/** short description of the account. */
	public description?: string;
	/** link to the account website. */
	public external_url?: string;
}

export class ProjectMeta {
	/** project image used for profile pic */
	public image?: string;
	/** main project image used for discovery */
	public main_capsule?: string;
	/** project friendly name */
	public name?: string;
	/** short description of the project. */
	public short_description?: string;
	/** extended description of the project. */
	public description?: string;
	/** link to the project website. */
	public external_url?: string;
	/** type used by clients to handle project */
	public type?: string;
	/** tags used for searching and categorization */
	public tags?: string[];
	/** videos and graphics of the project */
	public gallery?: GalleryMeta[];
	/** address where donations are sent*/
	public donation_address?: string;
	/** whether to prompt for donation */
	public prompt_donation?: boolean;
	/** launch project from external_url*/
	public launch_external?: boolean;
}

export class GalleryMeta {
	public name = '';
	public src = '';
	public type = '';
	public preview?: string;
}

export class ReleaseMeta {
	/** project image */
	public image?: string;
	/** full release name. */
	public name?: string;
	/** short description of the release. */
	public description?: string;
	/** link to the release assets. */
	public external_url?: string;
	/** source code snapshot */
	public source?: string;
	/** installable binaries */
	public install?: InstallMeta;
}

export class InstallMeta {
	/** binary name */
	public name?: string;
	/** web bundle */
	public web?: string;
	/** android/arm64 path */
	public android_arm64?: string;
	/** darwin/amd64 path */
	public darwin_amd64?: string;
	/** darwin/arm64 path */
	public darwin_arm64?: string;
	/** linux/386 path */
	public linux_386?: string;
	/** linux/amd64 path */
	public linux_amd64?: string;
	/** linux/arm path */
	public linux_arm?: string;
	/** linux/arm64 path */
	public linux_arm64?: string;
	/** windows/386 path */
	public windows_386?: string;
	/** windows/amd64 path */
	public windows_amd64?: string;
}