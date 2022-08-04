import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, _getRef) => {
  return {
    button: {
      width: 156,
      height: 40,

      padding: '8px 16px',
      borderRadius: 4,

      background: theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.white,

      border: theme.colorScheme === 'dark' 
        ? 'none'
        : '1px solid #FBFBFF',
    },
    dropdown: {
      border: 'none',
    },
  };
});