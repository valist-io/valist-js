
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
  team: {
    name: string,
  }
};

export type Log = {
  id: string,
  project: string,
  release: string,
  sender: string,
  team: string,
  type: string,
}