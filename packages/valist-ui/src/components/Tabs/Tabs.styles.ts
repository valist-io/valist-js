import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    tabsList: {
      gap: 16,
    },
    tabInner: {
      justifyContent: 'start',
    },
    tabsListWrapper: {
      borderBottom: 'none !important',
    },
    tabActive: {
      borderBottom: `4px solid ${theme.colors.purple[3]}`,
    },
    tabControl: {
      padding: 0,
      borderBottom: `4px solid ${theme.colors.dark[2]}`,
    },
    tabLabel: {
      fontSize: 16,
      color: theme.colorScheme === 'dark'
        ? theme.white
        : theme.black,
    }
  };
});