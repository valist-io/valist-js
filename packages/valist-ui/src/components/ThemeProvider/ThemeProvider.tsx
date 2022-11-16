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

  link?: any;
  image?: any;
}

export const globalStyles = (theme: MantineTheme) => ({
  body: { 
    backgroundColor: theme.colorScheme === 'dark'
      ? theme.colors.dark[9]
      : '#FBFBFF',
  },
});

export function ThemeProvider(props: ThemeProviderProps) {
  const themeOverride = { 
    ...theme,
    ...props.theme,
    components: {
      ...components,
      Anchor: {
        defaultProps: {
          component: props.link,
        },
      },
      _Image: {
        defaultProps: {
          component: props.image,
        },
      },
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