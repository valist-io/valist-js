export const shortnameRegex = /^[\w-]+$/g;
export const versionRegex = /^[\w-.]+$/g;
export const tagRegex = /^[a-z-]+$/g;

export const shortnameFilterRegex = /[^\w-]/g;
export const versionFilterRegex = /[^\w-.]/g;
export const tagFilterRegex = /[^a-z-]/g;
export const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/; // https://stackoverflow.com/a/27728417

export const refineYouTube = (val: string) => (
  val.length === 0 || youtubeRegex.test(val)
);

export const defaultTags = [
  'game', 'protocol', 'application', 'utilities', 'storage', 'networks',
  'social', 'communication', 'nft', 'defi', 'media', 'music',
];

export const defaultTypes = [
  'web', 'web-game', 'installable-game', 'binary/executable',
];