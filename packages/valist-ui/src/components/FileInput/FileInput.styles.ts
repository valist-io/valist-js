import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      height: 300,
      border: theme.colorScheme === 'dark'
        ? `1px dashed ${theme.colors.gray[2]}`
        : `1px dashed ${theme.colors.gray[3]}`,
    },
  };
});