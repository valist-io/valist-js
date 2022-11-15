import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    button: {
      padding: 16,
      border: `1px solid ${theme.colors.gray[1]}`,
      borderRadius: 10,
    }
  };
});


