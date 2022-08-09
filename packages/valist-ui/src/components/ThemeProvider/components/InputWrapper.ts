import { MantineTheme } from '@mantine/core';

export const InputWrapper = {
  styles: (theme: MantineTheme) => ({
    error: {
      color: theme.colors.red[3],
    },
    required: {
      color: theme.colors.red[3],
    },
  }),
};