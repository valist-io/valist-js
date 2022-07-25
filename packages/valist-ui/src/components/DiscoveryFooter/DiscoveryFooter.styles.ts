import { createStyles } from '@mantine/styles';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from "@mantine/core";

export default createStyles(() => {
  const isMobile = useMediaQuery('(max-width: 900px)');
  const theme = useMantineTheme();
	const bgColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';
  const color = theme.colorScheme === 'dark' ? 'white' : 'black';

  return {
    "root": {
      padding: isMobile ? '60px 23px' : '79px 113px', 
      background: bgColor,
    },
    "heading" : {
      fontSize: isMobile ? '18' : '20px',
      fontWeight: 900, 
      margin: '10px 0 15px 0',
    },
    "text": {
      fontSize: isMobile ? '14' : '16px',
      margin: '10px 0 15px 0',
      color: color,
      textDecoration: 'none',
    },
  };
});
