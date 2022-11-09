import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    modal: {
      minWidth: 524,
      borderRadius: 16,
      background: theme.colors.purple[3],
    },
    header: {
      padding: '26px 32px',
      borderRadius: '16px 16px 0 0',
      background: theme.colors.purple[4],
    },
    body: {
      padding: 32,
      borderRadius: '32px 32px 16px 16px',
      background: theme.white,
    }
  };
});


