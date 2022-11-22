import { createStyles } from "@mantine/styles";

export const useStyles = createStyles((theme) => ({
  root: {
    height: 168,
    width: '100%',
    borderRadius: 8,
    padding: 32,

    transition: "box-shadow",
    "&:hover": {
      boxShadow: `0 0 7px ${theme.colorScheme == "dark" ? "#3e3e3e" : "#343434"}`,
    },
  },
}));
