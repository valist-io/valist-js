import {
  ProjectMetaInterface,
  TokenMetadata,
  AccountMetaInterface,
  PlatformsMetaInterface,
} from "./typesShared";

export interface Channel {
  channel_id: number;
  channel_name: string;
  release_meta: {
    name: string;
    meta_uri: string;
    platforms: PlatformsMetaInterface;
    description: string;
  };
}

export interface Listing {
  channels: Channel[];
  disabled: boolean;
  project_id: string;
  updated_at: string;
  account_meta: AccountMetaInterface;
  account_name: string;
  project_meta: ProjectMetaInterface;
  project_name: string;
}

export interface ContractMetadata extends TokenMetadata {
  /** network chain id */
  chainId: string;
}
