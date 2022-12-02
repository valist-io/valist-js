import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, _getRef) => {
  const color = theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3];

  return {
    name: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color,
    },
    label: {
      color,
    },
  };
});