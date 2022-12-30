import { createStyles } from '@mantine/styles';

export default createStyles((theme, params, getRef) => {
  return {
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      width: 40,
      height: 40,

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
  };
});