import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, _getRef) => {
  return {
    link: {
      display: 'flex',
      padding: '14px 0 14px 30px',
      width: '100%',
    },
    active: {
      paddingLeft: 25,
      borderLeft: `5px solid ${theme.colors.purple[3]}`,
      backgroundColor: theme.colors.purple[0],
    },
  };
});