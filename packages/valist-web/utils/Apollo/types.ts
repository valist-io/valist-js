
export type Release = {
  name: string,
  metaURI: string,
}

export type Member = {
  id: string,
}

export type Project = {
  id: string,
  name: string,
  metaURI: string,
  account: {
    name: string,
  },
  product?: {
    id: string,
  }
  releases: { blockTime: string, metaURI: string, name: string }[]
};

export type Log = {
  id: string;
  type: string;
  sender: string;
  account?: {
    id: string;
    name: string;
  }
  project?: {
    id: string;
    name: string;
    account: {
      name: string;
    }
  },
  release?: {
    id: string;
    name: string;
  }
  member?: string;
}