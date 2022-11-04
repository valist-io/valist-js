import {
  Group,
  Text,
  Anchor,
} from '@mantine/core';

import useStyles from './Link.styles';
import type { Icon } from 'tabler-icons-react';

type targetType = '_blank' | '_self' | '_parent';

interface LinkProps {
  icon: Icon;
  text: string;
  href: string;
  active: boolean;
  target?: targetType;
}

export function Link(props: LinkProps) {
  const { classes } = useStyles({ active: props.active });
  const IconNode = props.icon;
  const attributes: {target?: targetType} = {}
  if (props.target) attributes.target = props.target;

  return (
    <Anchor className={classes.link} href={props.href} {...attributes}>
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