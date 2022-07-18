import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      width: '100%',
      height: 168,
      padding: 32,
      borderRadius: 8,
      background: theme.colorScheme === "dark" 
        ? "#030111" 
        : "#FFFF",
    }
  }
});