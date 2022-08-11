import { createStyles } from "@mantine/core";

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonStylesParams {
  variant: ButtonVariant;
}

export default createStyles((theme, params: ButtonStylesParams) => {
  return {
    button: {
      display: 'flex',
      flex: '0 0 56px',
      justifyContent: 'center',
      alignItems: 'center',

      width: 56,
      height: 56,
      borderRadius: '100%',

      filter: `
        drop-shadow(0px 7px 19.6px rgba(0, 0, 0, 0.05))
        drop-shadow(0px 2.8px 8.4px rgba(0, 0, 0, 0.05))`,

      color: params.variant === 'primary'
        ? theme.white
        : theme.colorScheme === 'dark'
        ? theme.white
        : theme.colors.gray[3],

      background: params.variant === 'primary'
        ? theme.colors.purple[3]
        : theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.white,
    }
  }
});