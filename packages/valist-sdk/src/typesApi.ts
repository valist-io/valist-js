import {
  ProjectMetaInterface,
  TokenMetadataInterface,
  AccountMetaInterface,
  PlatformsMetaInterface,
  SystemRequirements,
  WineSupport,
} from "./typesShared";

export interface ChannelReleaseMeta {
  name: string;
  meta_uri: string;
  platforms: PlatformsMetaInterface;
  description: string;
}

export interface Channel {
  channel_id: number;
  channel_name: string;
  release_meta: ChannelReleaseMeta;
  license_config: {
    id: number;
    access_codes: boolean;
    tokens: boolean;
  };
}

export interface ContractMetadata extends TokenMetadataInterface {
  /** network chain id */
  chain_id: string;
  /** dex or marketplace url where user can trade token */
  marketplace_urls?: string[];
}

export interface ProjectMetaApi extends Omit<ProjectMetaInterface, 'systemRequirements' | 'wineSupport'> {
  networks: ContractMetadata[];
  system_requirements?: SystemRequirements;
  wine_support?: WineSupport;
}

export interface PartialQuest {
  id: number;
  name: string;
}

export interface Listing {
  channels: Channel[];
  disabled: boolean;
  project_id: string;
  updated_at: string;
  account_meta: AccountMetaInterface;
  account_name: string;
  project_meta: ProjectMetaApi;
  project_name: string;
  timestamp: number;
  quests: PartialQuest[];
}
