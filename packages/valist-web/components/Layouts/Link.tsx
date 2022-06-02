import { ReactNode } from 'react';
import { NextLink } from '@mantine/next';
import { useMantineTheme, Text } from '@mantine/core';

interface LinkProps {
  href: string,
  children?: ReactNode,
}

export default function Link(props: LinkProps) {
  const { children, href, ...rest } = props;
  const theme = useMantineTheme();
  const color = theme.colorScheme === 'dark' ? theme.white : theme.black;

	return (
		<Text
      {...rest}
      variant="link"
      component={NextLink}
      weight={700}
      href={props.href}
      style={{ fontWeight: 100, textDecoration: "none", color }}
    >
      {children}
    </Text>
	);
}