export class CookieStorage {
  getItem(key: string) {
    if (typeof document !== 'undefined') {
      const matches = document.cookie.match(`(?:^|; )${key}=([^;]*)`);
      return matches ? decodeURIComponent(matches[1]) : null;  
    }
    return null;
  }

  setItem(key: string, value: string) {
    if (typeof document !== 'undefined') {
      document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  }

  removeItem(key: string) {
    if (typeof document !== 'undefined') {
      document.cookie = `${encodeURIComponent(key)}=;max-age=-1`;
    }
  }
}
