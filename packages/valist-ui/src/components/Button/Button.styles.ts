import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    primary: {
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
    secondary: {
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
    subtle: {
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
    text: {
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
    }
  };
});