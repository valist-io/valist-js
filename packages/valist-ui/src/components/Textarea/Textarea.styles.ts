import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      width: '100%',
    },
    input: {
      borderRadius: 8,

      borderColor: theme.colorScheme === "dark" 
        ? theme.colors.dark[6] 
        : theme.colors.gray[1],

      backgroundColor: theme.colorScheme === "dark" 
        ? theme.colors.dark[6] 
        : theme.white,

      '&:focus, &:focus-within': {
        borderColor: theme.colors.purple[1],
      },

      '&:disabled': {
        backgroundColor: theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],  
      },
    },
  }
})