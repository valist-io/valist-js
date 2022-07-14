import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    popoverBody: {
      border: 'none',
      borderRadius: 0,
    },
    popoverInner: {
      padding: 0,
    },
    popoverHeader: {
      padding: 24,
    },
    popoverList: {
      maxHeight: 266,
      overflow: 'scroll',
      padding: '0 24px',
    },
    popoverFooter: {
      padding: 24,
    },
  };
})