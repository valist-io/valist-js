import {
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';

import useStyles from './Link.styles';
import type { Icon } from 'tabler-icons-react';

interface LinkProps {
  icon: Icon;
  href: string;
  text: string;
  active: boolean;
}

export function Link(props: LinkProps) {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const IconNode = props.icon;

  const linkColor = props.active
    ? theme.colors.purple[3]
    : theme.colorScheme === 'dark'
    ? theme.colors.gray[2]
    : theme.colors.gray[3];

  return (
    <UnstyledButton 
      href={props.href}
      component="a"
      className={cx(classes.link, { [classes.active]: props.active })}
    >
      <Group noWrap>
        <IconNode
          color={linkColor} 
          size={24} 
          strokeWidth={2} 
          style={{ margin: '0 7px' }} />
        <Text color={linkColor}>
          {props.text}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

Link.defaultProps = {
  active: false,
};