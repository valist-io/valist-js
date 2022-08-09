import { createStyles } from "@mantine/core";

export default createStyles(() => {
  return {
    root: {
      marginBottom: 35,
    },
    input: {
      backgroundColor: "transparent",
      '&:checked': {
        backgroundColor: '#669F2A',
      },
    }
  }
});