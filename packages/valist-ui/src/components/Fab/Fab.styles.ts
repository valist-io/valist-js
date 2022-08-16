import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  return {
    wrapper: {
      display: 'flex',
      gap: 16,
      flexDirection: 'column',
      justifyContent: 'flex-end',

      position: 'fixed',
      bottom: 80,
      right: 24,

      zIndex: 90,
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      background: theme.colorScheme === 'dark'
        ? 'rgba(0, 0, 0, 0.85)'
        : 'rgba(255, 255, 255, 0.95)',

      zIndex: 80,
    }
  }
});