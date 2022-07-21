import { Client } from '@valist/sdk';

import { 
  showNotification, 
  hideNotification,
  updateNotification,
} from '@mantine/notifications';

// notification IDs
const LOADING_ID = 'valist-loading-notification';
const ERROR_ID = 'valist-error-notification';

// see https://stackoverflow.com/a/27728417
const youTubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/; 

export const refineYouTube = (val: string) => (
  val.length === 0 || youTubeRegex.test(val)
);

export const showError = (error: any) => showNotification({
  id: ERROR_ID,
  autoClose: false,
  color: 'red',
  title: 'Error',
  message: error.data?.message ?? error.message,
});

export const showLoading = (message: string) => showNotification({
  id: LOADING_ID,
  autoClose: false,
  disallowClose: true,
  loading: true,
  title: 'Loading',
  message: message,
});

export const updateLoading = (message: string) => updateNotification({
  id: LOADING_ID,
  autoClose: false,
  disallowClose: true,
  loading: true,
  title: 'Loading',
  message: message,
});

export const hideError = () => hideNotification(ERROR_ID);
export const hideLoading = () => hideNotification(LOADING_ID);

export async function writeFile(source: File | string, valist: Client): Promise<string> {
  if (typeof source === 'object') {
    const file = source as File;
    return await valist.writeFile({ path: file.name, content: file });
  } else {
    return source as string;
  }
}