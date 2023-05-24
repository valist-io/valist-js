import { FileObject as FObject } from "files-from-path";

export type FileObject = FObject;

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
	/** repository used for deployments */
	public repository?: string;
	/** hardware requirements */
	public systemRequirements?: {
		cpu: string;
		gpu: string;
		memory: string;
		disk: string;
	};
	/** supported compatibility layers (wine)  */
	public wineSupport?: {
		mac: boolean;
		linux: boolean;
	}
	/** supported networks for smart contracts */
	public networks?: NetworkMeta[]
}

export class NetworkMeta {
	chainId?: string;
	address?: string[];
}

export class GalleryMeta {
	public name = '';
	public src = '';
	public type = '';
	public preview?: string;
}

/*
	Example ReleaseMeta:
		{
			"external_url": "webCID || nativeCID",
			"install": {
				"web": {
					"external_url": "webCID",
					"name": "web"
				},
				"linux_amd64": {
					"external_url": "nativeCID/linux_amd64_build",
					"name": "binaryname"
				},
				"linux_arm64": {
					"external_url": "nativeCID/linux_arm64_build",
					"name": "binaryname"
				},
				"windows_amd64": {
					"external_url": "nativeCID/windows_amd64_build",
					"name": "binaryname",
					"dependencies": {
						"cpp-libs@version": "microsoft_link || cid"
					}
				}
			}
		}
		*/

export class ReleaseMeta {
	constructor(metadata_version = '2') {
		this._metadata_version = metadata_version;
		this.path = '';
		this.name = '';
		this.description = '';
		this.external_url = '';
		this.platforms = {};
	}
	/** valist metadata version */
	public _metadata_version: string;
	/** project image */
	public image?: string;
	/** full account/project/release path */
	public path: string;
	/** full release name. */
	public name: string;
	/** short description of the release. */
	public description: string;
	/** link to the release assets. */
	public external_url: string;
	/** source code snapshot */
	public source?: string;
	/** installable binaries and web bundles */
	public platforms: PlatformsMeta;
}

export type SupportedPlatform = 'web' | 'darwin_amd64' | 'darwin_arm64' | 'linux_amd64' | 'linux_arm64' | 'windows_amd64' | 'windows_arm64' | 'android_arm64';

export const supportedPlatforms: SupportedPlatform[] = ['web', 'darwin_amd64', 'darwin_arm64', 'linux_amd64', 'linux_arm64', 'windows_arm64', 'windows_amd64', 'android_arm64'];

export const platformNames: Record<SupportedPlatform, string> = {
	"web": "Web build",
	"windows_amd64": "Windows (amd64 / Intel)",
	"windows_arm64": "Windows (arm64)",
	"darwin_arm64": "macOS (arm64 / Apple Silicon)",
	"darwin_amd64": "macOS (amd64 / Intel)",
	"linux_amd64": "Linux (amd64 / Intel)",
	"linux_arm64": "Linux (arm64)",
	"android_arm64": "Android (arm64)",
};

type PlatformConfig = {
	name: string;			// binary name or original file name
	external_url: string;	// full path to file
	executable?: string; 	// path to executable
	installScript?: string; // optional install script
	processName?: string; // process name to inject values
	downloadSize?: string; // size of download
	installSize?: string; // size of install
};

export class PlatformsMeta {
	/** web bundle */
	public web?: PlatformConfig;
	/** android/arm64 path */
	public android_arm64?: PlatformConfig;
	/** darwin/amd64 path */
	public darwin_amd64?: PlatformConfig;
	/** darwin/arm64 path */
	public darwin_arm64?: PlatformConfig;
	/** linux/386 path */
	public linux_386?: PlatformConfig;
	/** linux/amd64 path */
	public linux_amd64?: PlatformConfig;
	/** linux/arm path */
	public linux_arm?: PlatformConfig;
	/** linux/arm64 path */
	public linux_arm64?: PlatformConfig;
	/** windows/386 path */
	public windows_386?: PlatformConfig;
	/** windows/amd64 path */
	public windows_amd64?: PlatformConfig;
	/** windows/arm64 path */
	public windows_arm64?: PlatformConfig;
}

export class ReleaseMetaV1 {
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
	/** windows/arm64 path */
	public windows_arm64?: string;
}

export function isReleaseMetaV1(releaseMeta: ReleaseMeta | ReleaseMetaV1): releaseMeta is ReleaseMetaV1 {
	const meta = releaseMeta as ReleaseMetaV1;
	return meta.install !== undefined || (meta as ReleaseMeta)._metadata_version === 'undefined';
}

export function isReleaseMetaV2(releaseMeta: ReleaseMeta | ReleaseMetaV1): releaseMeta is ReleaseMeta {
	const meta = releaseMeta as ReleaseMeta;
	return meta._metadata_version === '2';
}

export class ReleaseConfig {
	public account: string;
	public project: string;
	public release: string;
	public image?: string;
	public description?: string;
	public source?: string;
	public platforms: Record<SupportedPlatform, string>;

	constructor(account: string, project: string, release: string) {
		this.account = account;
		this.project = project;
		this.release = release;
		this.platforms = {
			web: '',
			darwin_amd64: '',
			darwin_arm64: '',
			windows_amd64: '',
			windows_arm64: '',
			linux_amd64: '',
			linux_arm64: '',
			android_arm64: '',
		};
	}
}
