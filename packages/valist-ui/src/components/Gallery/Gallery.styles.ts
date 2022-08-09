import { createStyles } from '@mantine/styles';

export default createStyles((theme, _params, getRef) => {
  return {
    preview: {
      borderRadius: '8px 8px 0 0',
      height: '450px', 
      display: 'flex', 
      backgroundColor: 'black',
      overflow: 'hidden',
    },
    image: {
      maxWidth: '100%', 
      maxHeight: '100%', 
      objectFit: 'contain', 
      margin: '0 auto',
    },
    video: {
      maxWidth: '100%', 
      maxHeight: '100%',
    },
    items: {
      borderRadius: '0 0 8px 8px',
      display: 'flex', 
      backgroundColor: '#171616', 
      overflowX: 'auto', 
      height: 80,
    }
  };
});