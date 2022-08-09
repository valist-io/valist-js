import { createStyles } from "@mantine/core";

export interface AccountStyleParams {
  large?: boolean;
}

export default createStyles((theme, params: AccountStyleParams, _getRef) => {
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