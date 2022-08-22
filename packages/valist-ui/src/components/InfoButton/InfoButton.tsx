import {
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';
import useStyles from './InfoButton.styles';

export interface InfoButtonProps {
  opened: boolean;
  onClick?: () => void;
}

export function InfoButton(props: InfoButtonProps) {
  const { classes } = useStyles();
  return (
    <UnstyledButton
      className={classes.button} 
      onClick={props.onClick}
    >
      <Group spacing={8} noWrap>
        { !props.opened && 
          <>
            <Icon.InfoCircle size={24} />
            <Text size={12}>Info</Text>
          </>
        }
        { props.opened &&
          <>
            <Icon.CircleX size={24} />
            <Text size={12}>Close</Text>
          </>
        }
      </Group>
    </UnstyledButton>
  );
}