import { createStyles } from "@mantine/core";

export interface RadioCardStylesProps {
  checked: boolean;
}

export default createStyles((theme, params: RadioCardStylesProps, _getRef) => {
  return {
    wrapper: {
      padding: 16,
      borderRadius: 8,

      background: !params.checked
        ? 'transparent'
        : theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.white,

      border: params.checked
        ? '1px solid transparent'
        : theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.dark[5]}`
        : `1px solid ${theme.colors.gray[1]}`,
    },
  };
});