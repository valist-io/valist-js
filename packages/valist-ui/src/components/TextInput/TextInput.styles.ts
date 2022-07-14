import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      width: '100%',
    },
    input: {
      height: 44,
      borderRadius: 8,
      padding: '0 16px',
      borderColor: theme.colorScheme === "dark" 
        ? "#2F2F41" 
        : "#F0F0F9",
      backgroundColor: theme.colorScheme === "dark" 
        ? "#1E1D26" 
        : "#FFFFFF",
    },
  }
})