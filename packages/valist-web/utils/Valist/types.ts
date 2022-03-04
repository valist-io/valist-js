
export declare type ReleaseArtifact = {
  architecure?: string,
  sha256?: string,
  provider?: string,
};

export declare type TeamMeta = {
  image?: string,
  name?: string,
  description?: string,
  external_url?: string,
};

export declare type ProjectMeta = {
  image?: string,
  name?: string,
  description?: string,
  external_url?: string,
  short_description?: string,
};

export type ReleaseMeta = {
  image?: string,
  name?: string,
  description?: string,
  external_url?: string,
  artifacts?: Map<string, ReleaseArtifact>,
  licenses?: string[],
};

export type License = {
  id: string,
  image: string,
  team: string,
  project: string,
  name: string,
  description: string,
}