import { youtubeRegex } from "../Validation";

export const getYouTubeID = (url: string) => {
  const res = url.match(youtubeRegex);
  console.log('REGEX', res);
  return res && res.length > 0 ? res[1] : null;
};

export const getYouTubeEmbedURL = (ytID: string) => {
  return `https://youtube.com/embed/${ytID}`;
};