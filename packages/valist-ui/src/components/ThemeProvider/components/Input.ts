import { MantineTheme } from '@mantine/core';

export const Input = {
  styles: (theme: MantineTheme) => ({
    input: {
      minHeight: 44,
      borderRadius: 8,
      padding: '0 16px',

      '::placeholder': {
        color: '#9B9BB1',
      },

      borderColor: theme.colorScheme === "dark" 
        ? theme.colors.dark[6] 
        : theme.colors.gray[1],

      backgroundColor: theme.colorScheme === "dark" 
        ? theme.colors.dark[6] 
        : theme.white,

      '&:focus, &:focus-within': {
        borderColor: theme.colors.purple[1],
      },

      '&:disabled': {
        backgroundColor: theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],  
      },
    },
    invalid: {
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    },
    rightSection: {
      right: 10,
    },
  }),
};