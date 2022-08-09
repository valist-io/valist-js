import { createStyles } from '@mantine/styles';
import { useMediaQuery } from '@mantine/hooks';

export default createStyles(() => {
  const isMobile = useMediaQuery('(max-width: 900px)');

  return {
    "cover": {
      minHeight: isMobile ? 424 : 500,
    },
    "bg" : {
      position: "absolute", 
      top: 0,
      zIndex: 3, 
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(19, 7, 14, 0.50)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "title" : {
      fontSize: isMobile ? "40px": "96px", 
      fontWeight: 900, 
      color: 'white', 
    },
    "tagline" : {
      color: 'white', 
      fontSize: isMobile ? "16px": "24px",
      fontStyle: "normal",
      fontWeight: 400,
      opacity: 0.8,
    }
  };
});
