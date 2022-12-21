import { MantineTheme } from '@mantine/core';

export const Tabs = {
  styles: (theme: MantineTheme) => ({
    tabsList: {
      gap: 16,
      borderBottom: 'none',
    },
    tabLabel: {
      fontSize: 16,
    },
    tab: {
      justifyContent: 'start',
      color: '#9B9BB1',
      padding: '0 0 8px 0',
      borderBottom: `4px solid ${theme.colors.gray[2]}`,

      '&[data-active]': {
        color: theme.colorScheme === 'dark'
          ? theme.white
          : theme.black,

        borderBottom: `4px solid ${theme.colors.purple[3]}`,
      },
      '&[data-active]:hover': {
        borderBottom: `4px solid ${theme.colors.purple[3]}`,
      },
      '&:hover': {
        backgroundColor: 'transparent',
        borderBottom: `4px solid ${theme.colors.gray[2]}`,
      },
    },
  }),
};