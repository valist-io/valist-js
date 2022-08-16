import { useClickOutside, useMediaQuery } from '@mantine/hooks';
import * as Icon from 'tabler-icons-react';
import React, { useState } from 'react';
import { Button } from './Button/Button';
import useStyles from './Fab.styles';

export interface FabProps {
  children?: React.ReactNode;
}

export const Fab = (props: FabProps) => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));

  const isHidden = useMediaQuery('(min-width: 1200px)', false);
  if (isHidden) return (<></>);
  
  return (
    <>
      {opened && <div className={classes.overlay} />}
      <div ref={ref} className={classes.wrapper}>
        {opened && props.children}
        <Button 
          variant="primary" 
          onClick={() => setOpened(!opened)}
        >
          <Icon.Plus size={32} />
        </Button>
      </div>
    </>
  );
};

Fab.Button = Button;