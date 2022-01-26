/**
 * 
 * @param text 
 * @param fromEnd number of characters on each side of the elipsis
 * @returns 
 */
export const truncate = (text: string, fromEnd: number) => {
  const elipsis = "...";
  if (text.length > fromEnd * 2 + elipsis.length) {
    return text.substring(0, fromEnd) + elipsis + text.substring(text.length - fromEnd);
  } else {
    return text;
  }
};
