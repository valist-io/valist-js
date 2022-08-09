import { createStyles } from '@mantine/styles';

export default createStyles(() => {
  return {
    "title": {
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 16,
    },
    "message": {
      fontSize: 16,
      fontWeight: 400,
      maxWidth: 448,
      marginBottom: 40,
    },
    "image": {
      maxWidth: 400,
    }
  };
});