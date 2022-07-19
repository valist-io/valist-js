import { createStyles } from '@mantine/styles';

export interface TabsStyleParams {
  withCard?: boolean;
}

export default createStyles((theme, params: TabsStyleParams, getRef) => {
  return {
    tabInner: {
      justifyContent: 'start',
    },
    tabsList: {
      gap: params.withCard ? 40 : 16,
    },
    tabsListWrapper: {
      background: !params.withCard
        ? 'none'
        : theme.colorScheme === 'dark'
        ? theme.black
        : theme.white,
      padding: params.withCard 
        ? '25px 25px 0px 25px'
        : 0,
      borderRadius: 8,
      borderBottom: 'none !important',
    },
    tabActive: {
      color: theme.colorScheme === 'dark'
        ? theme.white
        : theme.black,
      borderBottom: `4px solid ${theme.colors.purple[3]}`,
    },
    tabControl: {
      padding: 0,
      color: '#9B9BB1',
      borderBottom: `4px solid ${theme.colors.dark[2]}`,
    },
    tabLabel: {
      fontSize: 16,
    }
  };
});