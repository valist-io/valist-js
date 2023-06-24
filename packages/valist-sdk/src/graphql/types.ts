export type Account = {
  id: string;
  name?: string;
  metaURI?: string;

  members?: string[];
  projects?: Project[];
  logs?: Log[];

  blockTime?: number;
  blockNumber?: number;
  logIndex?: number;
};

export type Project = {
  id: string;
  name?: string;
  metaURI?: string;

  account?: string;
  product?: string;
  members?: Account[]; //list of accounts
  releases?: Release[];
  logs?: Log[];

  blockTime?: number;
  blockNumber?: number;
  logIndex?: number;
};

export type Release = {
  id: string;
  name?: string;
  metaURI?: string;

  project?: Project;
  signers?: string[];
  logs?: Log[];

  blockTime?: number;
  blockNumber?: number;
  logIndex?: number;
};

export type Product = {
  id: string;
  limit?: number;
  supply?: number;

  royaltyAmount?: number;
  royaltyRecipient?: string;

  project?: Project;
  currencies?: Currency[];
  purchases?: Purchase[];
};

export type Currency = {
  id: string;
  token?: string;
  product?: Product;
  price?: number;
  balance?: number;
};

export type Purchase = {
  id: string;
  recipient?: string;
  product?: Product;
  price?: number;
  blockTime?: number;
  blockNumber?: number;
  logIndex?: number;
};

export type User = {
  id: string;
  accounts?: Account[];
  projects?: Project[];
};

export type Log = {
  id: string;
  type?: string;

  sender?: string;
  member?: string;

  account?: Account;
  project?: Project;
  release?: Release;

  blockTime?: number;
  blockNumber?: number;
  logIndex?: number;
};
