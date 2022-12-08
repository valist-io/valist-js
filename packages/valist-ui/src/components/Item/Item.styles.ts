import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, _getRef) => {
  return {
    name: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    label: {
      color: theme.colorScheme === 'dark'
        ? theme.colors.gray[2]
        : theme.colors.gray[3],
    },
  };
});