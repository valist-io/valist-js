import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    popoverBody: {
      border: 'none',
    },
    popoverHeader: {
      padding: 24,
    },
    popoverList: {
      padding: '0 24px',
    },
    popoverFooter: {
      padding: 24,
    },
    popoverFooterIcon: {
      color: theme.colorScheme === 'dark' 
        ? theme.colors.dark[6]
        : theme.white,
    },
  };
})