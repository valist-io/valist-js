import { createStyles, getStylesRef } from '@mantine/core';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'text';

export interface ButtonStylesProps {
  variant: ButtonVariant;
}

export default createStyles((theme, params: ButtonStylesProps) => {
  const variant = {
    'primary': {
      color: theme.white,
      backgroundColor: theme.colors.purple[3],
      '&:hover': {
        backgroundColor: theme.colors.purple[4],
      },
      [`&:not(.${getStylesRef('loading')}):disabled`]: {
        color: theme.white,
        backgroundColor: theme.colors.purple[1],
      },
    },
    'secondary': {
      color: theme.colors.purple[3],
      backgroundColor: 'transparent',
      border: `1px solid ${theme.colors.purple[3]}`,
      '&:hover': {
        color: theme.colors.purple[4],
        border: `1px solid ${theme.colors.purple[4]}`,
        backgroundColor: 'transparent',
      },
      [`&:not(.${getStylesRef('loading')}):disabled`]: {
        color: theme.colors.purple[1],
        border: `1px solid ${theme.colors.purple[1]}`,
        backgroundColor: 'transparent',
      },
    },
    'subtle': {
      color: theme.colors.purple[3],
      backgroundColor: theme.colors.purple[0],
      '&:hover': {
        backgroundColor: theme.colors.purple[1],
      },
      [`&:not(.${getStylesRef('loading')}):disabled`]: {
        color: theme.colors.purple[2],
        backgroundColor: theme.colors.purple[0],
      },
    },
    'text': {
      color: theme.colors.purple[3],
      backgroundColor: 'transparent',
      '&:hover': {
        color: theme.colors.purple[5],
        backgroundColor: 'transparent',
      },
      [`&:not(.${getStylesRef('loading')}):disabled`]: {
        color: theme.colors.purple[1],
        backgroundColor: 'transparent',
      },
    }
  };

  return {
    label: {
      fontSize: 14,
      fontWeight: 700,
      lineHeight: '24px',
    },
    root: {
      height: 48,
      borderRadius: 8,
      padding: '12px 24px',
      ...variant[params.variant],
    },
  };
});