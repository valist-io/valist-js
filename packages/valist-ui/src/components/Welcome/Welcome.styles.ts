import { useMediaQuery } from '@mantine/hooks';
import { createStyles } from '@mantine/styles';

export default createStyles(() => {
  const isMobile = useMediaQuery('(max-width: 900px)');

  return {
    "img": {
      width: isMobile ? '100%' : 600,
      marginTop: 20,
      marginBottom: 20,
    },
  };
});