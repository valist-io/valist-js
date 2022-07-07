import { 
  ActionIcon,
  Drawer,
  Header,
  MediaQuery,
  Container,
  Burger,
  Image,
  Group,
  Title,
  Text,
  TextInput,
  useMantineTheme, 
} from '@mantine/core';

import { NextLink } from '@mantine/next';
import { useState, MouseEventHandler } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import ThemeButton from '../Theme/ThemeButton';
import * as Icons from 'tabler-icons-react';

interface Props {
  opened: boolean;
  onBurger: MouseEventHandler<HTMLButtonElement>;
}

export default function Nav(props: Props): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';

  return (
    <Header height={70} px="lg" style={{ backgroundColor }}>
      {/* Desktop */}
      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Group style={{ height: '100%' }} noWrap>
          <div style={{ width: 250, flexShrink: 0 }}>
            <NextLink href="/">
              <Group spacing={0} noWrap>
                <Image src="/images/logo.png" alt="Valist" height={32} />
                <Title order={2}>alist</Title>
              </Group>
            </NextLink>
          </div>
          <TextInput
            style={{ width: 300 }}
            radius="md"
            placeholder="Search"
            icon={<Icons.Search size={18} strokeWidth={3} />}
            onKeyPress={(e) => e.key === 'Enter' && router.push(`/search/${(e.target as HTMLTextAreaElement).value}`)}
          />
          <Group style={{ flexGrow: 1, flexShrink: 0 }} position="right" noWrap>
            <Text 
              variant="link" 
              component={NextLink} 
              target="_blank" 
              href="https://docs.valist.io/"
            >
              Docs
            </Text>
            <Text 
              variant="link" 
              component={NextLink} 
              href="/discover"
            >
              Discover
            </Text>
            <ConnectButton showBalance={false} />
            <ThemeButton />
          </Group>
        </Group>
      </MediaQuery>
      {/* Mobile */}
      <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
        <Group style={{ height: '100%' }} position="apart" noWrap>
          <NextLink href="/">
            <Group spacing={0}>
              <Image src="/images/logo.png" alt="Valist" height={32} />
              <Title order={2}>alist</Title>
            </Group>
          </NextLink>
          <Group style={{ flexGrow: 1, flexShrink: 0 }} position="right" noWrap>
            {/* Search button */}
            <ActionIcon
              title="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Icons.Search size={18} />
            </ActionIcon>
            {/* Search drawer */}
            <Drawer
              size="100%"
              position="right"
              padding="xl"
              opened={searchOpen}
              withCloseButton={false}
              onClose={() => setSearchOpen(false)}
            >
              <Group>
                <ActionIcon
                  title="Close"
                  onClick={() => setSearchOpen(false)}
                >
                  <Icons.ArrowLeft size={24} />
                </ActionIcon>
                <TextInput
                  style={{ flexGrow: 1 }}
                  radius="md"
                  placeholder="Search"
                  icon={<Icons.Search size={18} strokeWidth={3} />}
                  onKeyPress={(e) => e.key === 'Enter' && router.push(`/search/${(e.target as HTMLTextAreaElement).value}`)}
                />
              </Group>
            </Drawer>
            <ThemeButton />
            <Burger
              size="sm"
              opened={props.opened}
              onClick={props.onBurger}
              color={theme.colors.gray[6]}
            />
          </Group>
        </Group>
      </MediaQuery>
    </Header>
  );
};
