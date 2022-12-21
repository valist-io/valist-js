import { 
  showNotification, 
  hideNotification,
  updateNotification,
} from '@mantine/notifications';
import { ReactNode } from 'react';

// notification IDs
const LOADING_ID = 'valist-loading-notification';
const ERROR_ID = 'valist-error-notification';

export const showError = (error: string) => showNotification({
  id: ERROR_ID,
  autoClose: false,
  color: 'red',
  title: 'Error',
  message: error,
});

export const showErrorMessage = (error: any) => {
  let message = error.toString();
  if (error.toString().includes('ERC20: transfer amount exceeds balance')) {
    message = 'ERC20: transfer amount exceeds balance';
  }

  showNotification({
    id: ERROR_ID,
    autoClose: false,
    color: 'red',
    title: 'Error',
    message: message,
  });
};

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