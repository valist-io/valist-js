import { Client } from '@valist/sdk';
import { 
  showNotification, 
  hideNotification,
  updateNotification,
} from '@mantine/notifications';
import { ReactNode } from 'react';

// notification IDs
const LOADING_ID = 'valist-loading-notification';
const ERROR_ID = 'valist-error-notification';

export const showError = (error: any) => showNotification({
  id: ERROR_ID,
  autoClose: false,
  color: 'red',
  title: 'Error',
  message: error.data?.message ?? error.message,
});

export const showLoading = (message: ReactNode) => showNotification({
  id: LOADING_ID,
  autoClose: false,
  disallowClose: true,
  loading: true,
  title: 'Loading',
  message: message,
});

export const updateLoading = (message: ReactNode) => updateNotification({
  id: LOADING_ID,
  autoClose: false,
  disallowClose: true,
  loading: true,
  title: 'Loading',
  message: message,
});

export const hideError = () => hideNotification(ERROR_ID);
export const hideLoading = () => hideNotification(LOADING_ID);

export async function writeFile(source: File, valist: Client, onProgress?: (progress: number) => void): Promise<string> {
  if (typeof source === 'string') {
    return source as string;
  } else {
    const file = source as File;
    return await valist.writeFile(file, false, (progress: number) => {
      if(onProgress) onProgress(progress);
    });
  };
};