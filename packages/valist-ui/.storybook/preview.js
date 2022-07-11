import '../public/styles.css';

import React from 'react';
import { themes } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';
import { ThemeProvider } from '../src/components/ThemeProvider';

export const parameters = {
  actions: { 
    argTypesRegex: "^on[A-Z].*" 
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    dark: { ...themes.normal },
    light: { ...themes.normal },
    stylePreview: true,
  },
}

export const decorators = [
  (Story) => (
    <ThemeProvider colorScheme={useDarkMode() ? 'dark' : 'light'}>
      <Story />
    </ThemeProvider>
  ),
];