import { createStyles } from "@mantine/core";

export interface AccountStyleParams {
  large?: boolean;
}

export default createStyles((theme, params: AccountStyleParams, _getRef) => {
  return {
    name: {
      //fontSize: params.large ? 24 : 14,
      overflow: 'hidden', 
      whiteSpace: 'nowrap',
    },
    label: {
      //fontSize: params.large ? 22 : 12,
      color: theme.colorScheme === 'dark'
        ? theme.colors.gray[2]
        : theme.colors.gray[3],
    },
  };
});