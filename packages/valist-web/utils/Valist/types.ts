
export declare type ReleaseArtifact = {
  sha256: string;
  provider: string;
};

export declare type TeamMeta = {
  image?: string,
  name?: string;
  description?: string;
  external_url?: string,
};

export declare type ProjectMeta = {
  image?: string,
  name?: string;
  description?: string;
  external_url?: string,
};

export type ReleaseMeta = {
  image: string,
  name: string;
  description: string;
  external_url: string,
  artifacts: Record<string, ReleaseArtifact>;
};