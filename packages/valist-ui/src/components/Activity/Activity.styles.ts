import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    text: {
      fontSize: 14,
      overflow: 'hidden', 
      whiteSpace: 'nowrap',
    },
    link: {
      fontSize: 12,
      color: theme.colorScheme === 'dark'
        ? theme.colors.gray[2]
        : theme.colors.gray[3],
    },
  };
});