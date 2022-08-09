import { createStyles } from "@mantine/core";

export default createStyles((theme, params, _getRef) => {
  return {
    card: {
      padding: 14,
      borderRadius: 8,
      border: `1px solid ${theme.colors.gray[1]}`,
    },
    path: {
      overflow: 'hidden', 
      whiteSpace: 'nowrap',
    },
    size: {
      color: theme.colorScheme === 'dark'
        ? theme.colors.gray[2]
        : theme.colors.gray[3],
    },
    icon: {
      alignSelf: 'start',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 32,
      height: 32,
      borderRadius: '50%',
      color: theme.colors.purple[5],
      background: theme.colors.purple[1],
    }
  };
});