import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      padding: '0 24px 0 24px',
      borderBottom: theme.colorScheme === 'dark' 
        ? `1px solid #1E1D26`
        : '1px solid #E6E6F1',
      backgroundColor: theme.colorScheme === 'dark' 
        ? theme.colors.dark[9] 
        : theme.white,
    }
  };
});