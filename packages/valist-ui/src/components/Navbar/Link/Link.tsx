import {
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';

import useStyles from './Link.styles';
import type { Icon } from 'tabler-icons-react';

interface LinkProps {
  icon: Icon;
  text: string;
  active: boolean;
}

export function Link(props: LinkProps) {
  const { classes } = useStyles({ active: props.active });
  const IconNode = props.icon;

  return (
    <UnstyledButton className={classes.link}>
      <Group noWrap>
        <IconNode
          size={24} 
          strokeWidth={2} 
          className={classes.icon} 
        />
        <Text className={classes.text}>
          {props.text}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

Link.defaultProps = {
  active: false,
};