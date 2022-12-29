import { createStyles } from '@mantine/styles';

export default createStyles((theme, params, getRef) => {
  return {
    root: {
      display: 'inline-block',
      borderRadius: 4,
      padding: '8px 18px',

      color: theme.colorScheme === 'dark'
        ? theme.colors.gray[4]
        : theme.colors.gray[4],
      background: theme.colorScheme === 'dark'
        ? theme.colors.gray[6]
        : theme.colors.gray[1],
    },
  };
});