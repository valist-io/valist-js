import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    root: {
      padding: "0px 32px",
    },
    tabLabel: {
      color: theme.colorScheme ==="dark" ? "#9595A8" : "#79798A",
      fontSize: "14px",
    }, 
  };
})