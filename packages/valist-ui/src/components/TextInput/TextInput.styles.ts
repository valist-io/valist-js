import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      width: '100%',
    },
    input: {
      borderRadius: "8px",
      borderColor: theme.colorScheme === "dark" ? "#2F2F41" : "#E8E8EE",
      backgroundColor: theme.colorScheme === "dark" ? "#1E1D26" : "#FFFFFF",
    },
  }
})