import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      borderStyle: 'solid',
      borderRadius: '50%',
      borderWidth: 2,
      borderColor: theme.colorScheme === 'dark'
        ? theme.black
        : theme.white,
    },
    image: {
      borderRadius: '50%',
    }
  };
});


