import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    wrapper: {
      height: 300,
      display: 'flex',
      gap: theme.spacing.sm,

      [`@media screen and (max-width: ${theme.breakpoints.sm}px)`]: {
        flexDirection: 'column',
      }
    },
    dropzone: {
      flex: '1 1 0px',
      border: theme.colorScheme === 'dark'
        ? `1px dashed ${theme.colors.gray[2]}`
        : `1px dashed ${theme.colors.gray[3]}`,
    },
    preview: {
      flex: '1 1 0px',
      overflow: 'scroll',
      gap: 0,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colorScheme === 'dark'
        ? '#1E1D26'
        : theme.colors.gray[0],
    },
    file: {
      paddingTop: 4,
      paddingRight: theme.spacing.sm,
      paddingLeft: theme.spacing.sm,
      whiteSpace: 'nowrap', 
    }
  };
});