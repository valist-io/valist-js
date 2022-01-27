
export type Release = {
  tag: string,
  releaseCID: string,
}

export type Key = {
  role: string,
  address: string,
}

export type Project = {
    id: string,
    name: string,
    metaCID: string,
    releases: Release[],
    keys: Key[],
}

export declare type ReleaseArtifact = {
  sha256: string;
  provider: string;
};

export declare type ProjectMeta = {
  name: string;
  description: string;
  homepage?: string;
};

export type ReleaseMeta = {
  name: string;
  readme: string;
  license?: string;
  dependencies?: string[];
  artifacts: Record<string, ReleaseArtifact>;
};