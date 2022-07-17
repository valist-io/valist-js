import { createStyles } from "@mantine/core";

export default createStyles((theme) => {
  const stepBg = theme.colorScheme === 'dark' ? '' : '#9B9BB1';

  return {
    stepIcon: {
      backgroundColor: "transparent",
      borderColor: stepBg,
    },
    stepProgress: {
      borderColor: stepBg,
    },
    stepCompleted: {
    },
  }
});