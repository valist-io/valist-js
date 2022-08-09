import { useMediaQuery } from '@mantine/hooks';
import { createStyles } from '@mantine/styles';

export default createStyles(() => {
  const isMobile = useMediaQuery('(max-width: 900px)');

  return {
    "orderSelect": {
      float: isMobile ? "none" : "right",
      marginTop: isMobile ? 15 : 0,
    },
  };
});