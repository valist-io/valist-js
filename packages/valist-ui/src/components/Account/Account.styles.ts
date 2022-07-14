import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    name: {
      fontSize: 14,
      overflow: 'hidden', 
      whiteSpace: 'nowrap',
    },
    label: {
      fontSize: 12,
      color: theme.colorScheme === 'dark'
        ? theme.colors.gray[2]
        : theme.colors.gray[3],
    },
  };
});