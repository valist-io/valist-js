import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      height: 186,
      padding: 32,
      background: theme.colorScheme === "dark" ? "#030111" : "#FFFF",
    }
  }
});