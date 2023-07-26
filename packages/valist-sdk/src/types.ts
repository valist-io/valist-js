import { FileLike as FObject } from "./filesFromPaths";
import {
  AccountMetaInterface,
  GalleryMetaInterface,
  PlatformsMetaInterface,
  ProjectMetaInterface,
  SupportedPlatform,
  TokenMetadataInterface,
} from "./typesShared";

export {PlatformConfig, SupportedPlatform, TokenType} from "./typesShared";

export type FileObject = FObject;

function autoImplement<T>(): new () => T {
  return class {} as new () => T;
}

// Valist Types
export class AccountMeta extends autoImplement<AccountMetaInterface>() {}

export class ProjectMeta extends autoImplement<ProjectMetaInterface>() {
  /** supported networks for smart contracts */
  public networks?: NetworkMeta[];
}

export interface TokenMetadata extends TokenMetadataInterface {
  /** dex or marketplace url where user can trade token */
  marketplaceUrls?: string[];
}

export interface NetworkMeta {
  /** network chain id */
  chainId: string;
  /** tokens required to play game on this chain */
  tokens?: TokenMetadata[];
}

export class GalleryMeta extends autoImplement<GalleryMetaInterface>() {}

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
  constructor(metadata_version = "2") {
    this._metadata_version = metadata_version;
    this.path = "";
    this.name = "";
    this.description = "";
    this.external_url = "";
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
  public platforms: PlatformsMetaInterface;
}

export const supportedPlatforms: SupportedPlatform[] = [
  "web",
  "darwin_amd64",
  "darwin_arm64",
  "linux_amd64",
  "linux_arm64",
  "windows_arm64",
  "windows_amd64",
  "android_arm64",
];

export const platformNames: Record<SupportedPlatform, string> = {
  web: "Web build",
  windows_amd64: "Windows (amd64 / Intel)",
  windows_arm64: "Windows (arm64)",
  darwin_arm64: "macOS (arm64 / Apple Silicon)",
  darwin_amd64: "macOS (amd64 / Intel)",
  linux_amd64: "Linux (amd64 / Intel)",
  linux_arm64: "Linux (arm64)",
  android_arm64: "Android (arm64)",
};

export class PlatformsMeta extends autoImplement<PlatformsMetaInterface>() {}

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

export function isReleaseMetaV1(
  releaseMeta: ReleaseMeta | ReleaseMetaV1
): releaseMeta is ReleaseMetaV1 {
  const meta = releaseMeta as ReleaseMetaV1;
  return (
    meta.install !== undefined ||
    (meta as ReleaseMeta)._metadata_version === "undefined"
  );
}

export function isReleaseMetaV2(
  releaseMeta: ReleaseMeta | ReleaseMetaV1
): releaseMeta is ReleaseMeta {
  const meta = releaseMeta as ReleaseMeta;
  return meta._metadata_version === "2";
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
      web: "",
      darwin_amd64: "",
      darwin_arm64: "",
      windows_amd64: "",
      windows_arm64: "",
      linux_amd64: "",
      linux_arm64: "",
      android_arm64: "",
    };
  }
}
