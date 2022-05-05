import { ProjectMeta } from "@valist/sdk";

export const shortnameFilterRegex = /[^\w-]/g;
export const versionFilterRegex = /[^\w-.]/g;
export const tagFilterRegex = /[^a-z-]/g;
export const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/; // https://stackoverflow.com/a/27728417

export const projectMetaChanged = (original: ProjectMeta, current: ProjectMeta):Boolean => {
  if (original.image !== current.image) return true;
  if (original.name !== current.name) return true;
  if (original.description !== current.description) return true;
  if (original.short_description !== current.short_description) return true;
  if (original.external_url !== current.external_url) return true;
  if (original.type !== current.type) return true;
  if (original.tags !== current.tags) return true;
  if (original.gallery !== current.gallery) return true;
  return false;
};