import { createStyles } from '@mantine/styles';

export type TabsVariant = 'default' | 'card';

export interface TabsStyleParams {
  variant: TabsVariant;
}

export default createStyles((theme, params: TabsStyleParams, getRef) => {
  const background = theme.colorScheme === 'dark' 
    ? theme.colors.dark[7]
    : theme.white;

  return {
    tabInner: {
      justifyContent: 'start',
    },
    tabsList: {
      gap: params.variant === 'card' 
        ? 40 
        : 16,
    },
    tabsListWrapper: {
      background: params.variant === 'card'
        ? background
        : 'none',
      padding: params.variant === 'card'
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
      borderBottom: params.variant === 'card'
        ? `4px solid ${background}`
        : `4px solid ${theme.colors.dark[2]}`,
    },
    tabLabel: {
      fontSize: 16,
    }
  };
});