import { createStyles } from '@mantine/styles';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'text' | 'outline';

export interface ButtonStylesProps {
  variant: ButtonVariant;
}

export default createStyles((theme, params: ButtonStylesProps, getRef) => {
  const variant = {
    'primary': {
      color: theme.white,
      backgroundColor: theme.colors.purple[3],
      '&:hover': {
        backgroundColor: theme.colors.purple[4],
      },
      [`&:not(.${getRef('loading')}):disabled`]: {
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
      [`&:not(.${getRef('loading')}):disabled`]: {
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
      [`&:not(.${getRef('loading')}):disabled`]: {
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
      [`&:not(.${getRef('loading')}):disabled`]: {
        color: theme.colors.purple[1],
        backgroundColor: 'transparent',
      },
    },
    'outline': {
      color: theme.colors.gray[3],
      border: `1px solid ${theme.colors.gray[1]}`,
      backgroundColor: 'transparent',
      '&:hover': {
        color: theme.colors.gray[5],
        backgroundColor: 'transparent',
      },
      [`&:not(.${getRef('loading')}):disabled`]: {
        color: theme.colors.gray[1],
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