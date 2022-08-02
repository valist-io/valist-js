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
  };
})