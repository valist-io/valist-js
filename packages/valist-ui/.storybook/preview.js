import '../public/styles.css';

import React from 'react';
import { themes } from '@storybook/theming';
import { MantineProvider } from '@mantine/core'

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
    <MantineProvider>
      <Story />
    </MantineProvider>
  ),
];