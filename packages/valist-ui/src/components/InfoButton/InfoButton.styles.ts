import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    button: {
      width: 79,
      height: 34,
      padding: 4,

      border: '1px solid #F0F0F9',
      background: theme.white,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
  };
});


