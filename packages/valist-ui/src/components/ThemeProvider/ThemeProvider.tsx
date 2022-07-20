import { 
  MantineProvider, 
  MantineTheme,
  ColorScheme,
  Global,
} from '@mantine/core';

import React from 'react';
import { theme } from './theme';

export interface ThemeProviderProps {
  children?: React.ReactNode;
  colorScheme?: ColorScheme;
  defaultProps?: Record<string, Record<string, any>>;
}

export const globalStyles = (theme: MantineTheme) => ({
  body: { 
    backgroundColor: theme.colorScheme === 'dark'
      ? theme.colors.dark[9]
      : '#FBFBFF',
  },
});

export function ThemeProvider(props: ThemeProviderProps) {
  const colorScheme = props.colorScheme;

  return (
    <MantineProvider 
      theme={{...theme, colorScheme}}
      defaultProps={props.defaultProps}
      withGlobalStyles 
      withNormalizeCSS
    >
      <Global styles={globalStyles} />
      {props.children}
    </MantineProvider>
  );
}

ThemeProvider.defaultProps = {
  colorScheme: 'light',
};