import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, _getRef) => {
  return {
    root: {
      borderRight: 'none',
      backgroundColor: theme.colorScheme === 'dark' 
        ? theme.colors.dark[9] 
        : theme.white,
    },
  };
});