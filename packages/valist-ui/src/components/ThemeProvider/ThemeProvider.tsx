import { 
  MantineProvider, 
  MantineTheme,
  MantineThemeOverride,
  Global,
} from '@mantine/core';

import React from 'react';
import { theme } from './theme';
import { components } from './components';

export interface ThemeProviderProps {
  children?: React.ReactNode;
  theme?: MantineThemeOverride;
}

export const globalStyles = (theme: MantineTheme) => ({
  body: { 
    backgroundColor: theme.colorScheme === 'dark'
      ? theme.colors.dark[9]
      : '#FBFBFF',
  },
});

export function ThemeProvider(props: ThemeProviderProps) {
  const { components: componentsProps, ...themeProps } = props.theme;

  const themeOverride = { 
    ...theme,
    ...themeProps,
    components: { 
      ...components, 
      ...componentsProps,
    },
  };

  return (
    <MantineProvider 
      theme={themeOverride}
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