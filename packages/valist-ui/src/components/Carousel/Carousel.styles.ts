import { createStyles } from '@mantine/styles';
import { useMediaQuery } from '@mantine/hooks';

export default createStyles(() => {
  const isMobile = useMediaQuery('(max-width: 900px)');

  return {
    "title": {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: isMobile ? 18 : 32,
      margin: 0,
    },
  };
});
