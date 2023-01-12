export const shortnameRegex = /^[a-zA-Z0-9-]+$/g;
export const versionRegex = /^[\w-.]+$/g;

export const shortnameFilterRegex = /[^a-zA-Z0-9-]/g;
export const versionFilterRegex = /[^\w-.]/g;
export const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/; // https://stackoverflow.com/a/27728417

export const cidRegex = /(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})/g;

export const refineYouTube = (val: string) => (
  val.length === 0 || youtubeRegex.test(val)
);

export const defaultTags = [
  'game', 'protocol', 'application', 'utilities', 'storage', 'networks',
  'social', 'communication', 'nft', 'defi', 'media', 'music',
];

export const defaultTypes = [
  'web', 'native', 'cli',
];

export const normalizeError = (error: unknown) => {
  const errorString = String(error);
  const notMember = 'err-not-member';
  const nameClaimed = 'err-name-claimed';
  const deniedSignature = 'User denied message signature';
  const exceedsBalance = 'ERC20: transfer amount exceeds balance';

  console.log('error', errorString);
  if (errorString.includes(deniedSignature)) return 'User denied message signature.';
  if (errorString.includes(notMember)) return 'Name already claimed.';
  if (errorString.includes(nameClaimed)) return 'Not a member.';
  if (errorString.includes(exceedsBalance)) return 'ERC20: transfer amount exceeds balance.';
  return errorString;
};