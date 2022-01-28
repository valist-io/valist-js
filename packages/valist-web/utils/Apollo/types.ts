
export type Release = {
  tag: string,
  releaseURI: string,
}

export type Key = {
  role: string,
  address: string,
}

export type Project = {
    id: string,
    name: string,
    metaURI: string,
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
  repository?: string,
  homepage?: string;
};

export type ReleaseMeta = {
  name: string;
  readme: string;
  license?: string;
  dependencies?: string[];
  artifacts: Record<string, ReleaseArtifact>;
};