import { ActionIcon, Group, useMantineTheme } from "@mantine/core";
import * as Icons from 'tabler-icons-react';
import Link from "next/link";

export function SocialIcons(): JSX.Element {
	const theme = useMantineTheme();
	const linkColor = theme.colorScheme === 'dark' ? 'white' : theme.colors.gray[6];
  
  return (
    <Group spacing="lg">
      <ActionIcon 
        variant="transparent" 
        component={Link}
        target="_blank" 
        href="https://valist.io/discord"
      >
        <Icons.BrandDiscord color={linkColor} size={48} strokeWidth={2} />
      </ActionIcon>
      <ActionIcon 
        variant="transparent"
        component={Link}
        target="_blank" 
        href="https://twitter.com/Valist_io"
      >
        <Icons.BrandTwitter color={linkColor} size={48} strokeWidth={2} />
      </ActionIcon>
      <ActionIcon 
        variant="transparent"
        component={Link}
        target="_blank" 
        href="https://github.com/valist-io"
      >
        <Icons.BrandGithub color={linkColor} size={48} strokeWidth={2} />
      </ActionIcon>
    </Group>
  );
}