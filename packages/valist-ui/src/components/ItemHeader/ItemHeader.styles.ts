import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    action: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      width: 48,
      height: 48,

      borderRadius: '100%',

      color: theme.colorScheme === 'dark'
        ? theme.white
        : theme.colors.gray[3],

      background: theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : 'transparent',

      border: theme.colorScheme === 'dark'
        ? 'none'
        : `1px solid ${theme.colors.gray[1]}`,
    },
    wrapper: {
      flexGrow: 1,
      justifyContent: 'space-between',

      '@media screen and (max-width: 1200px)': {
        display: 'none',
      },
    },
  };
});