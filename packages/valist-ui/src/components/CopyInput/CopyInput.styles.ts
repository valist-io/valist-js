import { createStyles } from '@mantine/styles';
import { useMantineTheme } from "@mantine/core";

export default createStyles(() => {
  const theme = useMantineTheme();
  const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[4];
  const textColor = theme.colorScheme === 'dark' ? '' : `${theme.colors.gray[4]} !important`;

  return {
    disabled: {
      borderColor,
      color: textColor,
    },
  };
});
