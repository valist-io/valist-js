export interface GalleryMetaInterface {
  name: string;
  src: string;
  type: string;
  preview?: string;
}

export interface SystemRequirements {
  cpu: string;
  gpu: string;
  memory: string;
  disk: string;
}

export interface WineSupport {
  mac: boolean;
  linux: boolean;
}

export interface ProjectMetaInterface {
  /** project image used for profile pic */
  image?: string;
  /** true/false for uses HyperPlay overlay */
  uses_overlay?: boolean;
  /** true/false for if a game is only published on HyperPlay */
  is_hyperplay_exclusive?: boolean;
  /** main project image used for discovery */
  main_capsule?: string;
  /** project friendly name */
  name?: string;
  /** short description of the project. */
  short_description?: string;
  /** extended description of the project. */
  description?: string;
  /** link to the project website. */
  external_url?: string;
  /** link to the project discord. */
  discord_url?: string;
  /** link to the project youtube. */
  youtube_url?: string;
  /** link to the project twitter. */
  twitter_url?: string;
  /** type used by clients to handle project */
  type?: string;
  /** tags used for searching and categorization */
  tags?: string[];
  /** videos and graphics of the project */
  gallery?: GalleryMetaInterface[];
  /** address where donations are sent*/
  donation_address?: string;
  /** whether to prompt for donation */
  prompt_donation?: boolean;
  /** launch project from external_url*/
  launch_external?: boolean;
  /** launch epic */
  launch_epic?: boolean;
  /** epic game url used for epic auth & services */
  epic_game_url?: string;
  /** repository used for deployments */
  repository?: string;
  /** hardware requirements */
  systemRequirements?: SystemRequirements;
  /** supported compatibility layers (wine)  */
  wineSupport?: WineSupport;
}

export interface AccountMetaInterface {
  /** account image */
  image?: string;
  /** account friendly name. */
  name?: string;
  /** short description of the account. */
  description?: string;
  /** link to the account website. */
  external_url?: string;
}

export interface PlatformConfig {
  name: string; // binary name or original file name
  external_url: string; // full path to file
  executable?: string; // path to executable
  installScript?: string; // optional install script
  processName?: string; // process name to inject values
  installSize?: string; // install size in bytes
  downloadSize?: string; // download size in bytes
}

export interface PlatformsMetaInterface {
  /** web bundle */
  web?: PlatformConfig;
  /** android/arm64 path */
  android_arm64?: PlatformConfig;
  /** darwin/amd64 path */
  darwin_amd64?: PlatformConfig;
  /** darwin/arm64 path */
  darwin_arm64?: PlatformConfig;
  /** linux/386 path */
  linux_386?: PlatformConfig;
  /** linux/amd64 path */
  linux_amd64?: PlatformConfig;
  /** linux/arm path */
  linux_arm?: PlatformConfig;
  /** linux/arm64 path */
  linux_arm64?: PlatformConfig;
  /** windows/386 path */
  windows_386?: PlatformConfig;
  /** windows/amd64 path */
  windows_amd64?: PlatformConfig;
  /** windows/arm64 path */
  windows_arm64?: PlatformConfig;
}

export type SupportedPlatform =
  | "web"
  | "darwin_amd64"
  | "darwin_arm64"
  | "linux_amd64"
  | "linux_arm64"
  | "windows_amd64"
  | "windows_arm64"
  | "android_arm64";

/** user-friendly token type is used in favor of ERC standard */
export type TokenType = "fungible" | "semiFungible" | "nonFungible" | "other";

export interface TokenMetadataInterface {
  /** token contract address */
  address: string;
  /** token icon */
  icon?: string;
  /** token fungible type */
  type?: TokenType;
  /** name of token */
  name?: string;
}
