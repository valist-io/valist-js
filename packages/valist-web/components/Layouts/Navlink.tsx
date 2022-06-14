import {
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';

import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';
import type { Icon } from 'tabler-icons-react';

interface NavlinkProps {
  icon: Icon,
  text: string,
  href: string,
}

const activeStyle = {
  borderLeft: '5px solid #5850EC',
  backgroundColor: '#EEEEFD',
};

export default function Navlink(props: NavlinkProps): JSX.Element {
  const theme = useMantineTheme();
  const router = useRouter();
  const Icon = props.icon;

  const active = router.asPath === props.href;
  const buttonStyle = active ? activeStyle : {};

  const linkColor = () => {
    if (active) {
      return '#5850EC';
    } else if (theme.colorScheme === 'dark') {
      return 'white';
    } else {
      return theme.colors.gray[6];
    }
  };

  return (
    <UnstyledButton 
      pl={30} 
      py="md"
      href={props.href}
      component={NextLink}
      style={buttonStyle}
    >
      <Group>
        <Icon
          color={linkColor()} 
          size={24} 
          strokeWidth={2} 
          style={{ margin: '0 7px' }} />
        <Text color={linkColor()}>
          {props.text}
        </Text>
      </Group>
    </UnstyledButton>
  );
}