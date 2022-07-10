import { 
  MantineProvider, 
  ColorScheme,
} from '@mantine/core';

import React from 'react';
import { theme } from './theme';

export interface ThemeProviderProps {
  children?: React.ReactNode;
  colorScheme?: ColorScheme;
}

export function ThemeProvider(props: ThemeProviderProps) {
  const colorScheme = props.colorScheme;
  return (
    <MantineProvider 
      theme={{...theme, colorScheme}} 
      withGlobalStyles 
      withNormalizeCSS
    >
      {props.children}
    </MantineProvider>
  );
}

ThemeProvider.defaultProps = {
  colorScheme: 'light',
};