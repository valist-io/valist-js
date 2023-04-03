export const shortnameRegex = /^[a-zA-Z0-9-]+$/g;
export const versionRegex = /^[\w-.]+$/g;

export const shortnameFilterRegex = /[^a-zA-Z0-9-]/g;
export const versionFilterRegex = /[^\w-.]/g;
export const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/; // https://stackoverflow.com/a/27728417

export const refineYouTube = (val: string) => (
  val.length === 0 || youtubeRegex.test(val)
);

export const defaultNetworks = [
  { value: "1", label: "ethereum" },
  { value: "8", label: "ubiq" },
  { value: "10", label: "optimism" },
  { value: "19", label: "songbird" },
  { value: "20", label: "elastos" },
  { value: "24", label: "kardiachain" },
  { value: "25", label: "cronos" },
  { value: "30", label: "rsk" },
  { value: "40", label: "telos" },
  { value: "50", label: "xdc" },
  { value: "52", label: "csc" },
  { value: "55", label: "zyx" },
  { value: "56", label: "binance" },
  { value: "57", label: "syscoin" },
  { value: "60", label: "gochain" },
  { value: "61", label: "ethereumclassic" },
  { value: "66", label: "okexchain" },
  { value: "70", label: "hoo" },
  { value: "82", label: "meter" },
  { value: "87", label: "nova network" },
  { value: "88", label: "tomochain" },
  { value: "100", label: "xdai" },
  { value: "106", label: "velas" },
  { value: "108", label: "thundercore" },
  { value: "122", label: "fuse" },
  { value: "128", label: "heco" },
  { value: "137", label: "polygon" },
  { value: "200", label: "xdaiarb" },
  { value: "246", label: "energyweb" },
  { value: "250", label: "fantom" },
  { value: "269", label: "hpb" },
  { value: "288", label: "boba" },
  { value: "321", label: "kucoin" },
  { value: "336", label: "shiden" },
  { value: "361", label: "theta" },
  { value: "416", label: "sx" },
  { value: "534", label: "candle" },
  { value: "592", label: "astar" },
  { value: "888", label: "wanchain" },
  { value: "1088", label: "metis" },
  { value: "1231", label: "ultron" },
  { value: "1234", label: "step" },
  { value: "1284", label: "moonbeam" },
  { value: "1285", label: "moonriver" },
  { value: "2000", label: "dogechain" },
  { value: "2222", label: "kava" },
  { value: "4689", label: "iotex" },
  { value: "5050", label: "xlc" },
  { value: "5551", label: "nahmii" },
  { value: "6969", label: "tombchain" },
  { value: "7700", label: "canto" },
  { value: "8217", label: "klaytn" },
  { value: "9001", label: "evmos" },
  { value: "10000", label: "smartbch" },
  { value: "32520", label: "bitgert" },
  { value: "32659", label: "fusion" },
  { value: "39815", label: "oho" },
  { value: "42161", label: "arbitrum" },
  { value: "42170", label: "arb-nova" },
  { value: "42220", label: "celo" },
  { value: "42262", label: "oasis" },
  { value: "43114", label: "avalanche" },
  { value: "47805", label: "rei" },
  { value: "55555", label: "reichain" },
  { value: "71402", label: "godwoken" },
  { value: "333999", label: "polis" },
  { value: "420420", label: "kekchain" },
  { value: "888888", label: "vision" },
  { value: "1313161554", label: "aurora" },
  { value: "1666600000", label: "harmony" },
  { value: "11297108109", label: "palm" },
  { value: "836542336838601", label: "curio" },
];

export const defaultTags = [
  'game', 'protocol', 'application', 'utilities', 'storage', 'networks',
  'social', 'communication', 'nft', 'defi', 'media', 'music',
];

export const defaultTypes = [
  { value: 'browser', label: 'browser application' },
  { value: 'native', label: 'native desktop application' },
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

export const isFile = (file: File | string): file is File => {
  return (file as File).lastModified !== undefined;
};

export const isFileArray = (files: File[] | string): files is File[] => {
  return files?.length > 0 && isFile(files[0]);
};