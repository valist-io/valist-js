import { createStyles } from '@mantine/styles';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'text';

export interface ButtonStylesProps {
  variant: ButtonVariant;
}

export default createStyles((theme) => {
  return {
    root: {
      height: 48,
      borderRadius: 8,
      padding: '10px 15px',
      marginBottom: 80,
      color: theme.white,
      fontSize: 14,
      fontWeight: 700,
      backgroundColor: theme.colors.purple[3],
      '&:hover': {
        backgroundColor: theme.colors.purple[4],
      },
    },
    hidden: {
      display: 'none',
    },
  };
});