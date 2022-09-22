import { createStyles } from "@mantine/core";

export interface EditButtonStylesProps {
  fill: boolean;
}

export default createStyles((theme, params: EditButtonStylesProps, getRef) => {
  return {
    button: {
      padding: 16,
      borderRadius: 8,

      border: params.fill
        ? 'none'
        : `1px solid ${theme.colors.gray[0]}`,

      background: params.fill
        ? '#FBFBFF'
        : 'transparent',
    },
  }
});