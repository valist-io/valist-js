import {
  Group,
  Text,
  Anchor,
} from '@mantine/core';

import useStyles from './Link.styles';
import type { Icon } from 'tabler-icons-react';

interface LinkProps {
  icon: Icon;
  text: string;
  href: string;
  active: boolean;
}

export function Link(props: LinkProps) {
  const { classes } = useStyles({ active: props.active });
  const IconNode = props.icon;

  return (
    <Anchor className={classes.link} href={props.href}>
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
    </Anchor>
  );
}

Link.defaultProps = {
  active: false,
};