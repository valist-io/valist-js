import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, _getRef) => {
  return {
    preview: {
      width: 75,
      height: 75,
      backgroundColor: theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
      border: `1px solid ${theme.colors.gray[2]}`,
      borderRadius: theme.radius.md,
    },
    remove: {
      bottom: 5, 
      right: 3, 
      zIndex: 100,
      position: 'absolute',
      borderRadius: '50%',
      backdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',

      [':hover']: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',        
      }
    }
  };
});