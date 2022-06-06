import { 
  Header,
  MediaQuery,
  Burger,
  Image,
  Group,
  Container,
  Title,
  TextInput,
  useMantineTheme 
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';
import { Search } from 'tabler-icons-react';
import ThemeButton from '../Theme/ThemeButton';
import Link from './Link';

interface Props {
  opened: boolean;
  onBurger: () => {};
}

export default function(props: Props): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();

  const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';

  return (
    <Header height={70} p="md" style={{ backgroundColor }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={props.opened}
            onClick={props.onBurger}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <NextLink href="/">
          <Group spacing={0}>
            <Image src="/images/logo.png" alt="Valist" height={32} />
            <Title order={2}>alist</Title>
          </Group>
        </NextLink>
        <Container>
          <TextInput
            placeholder="Search"
            variant="filled"
            icon={<Search size={18} strokeWidth={3} />}
            onKeyPress={(e) => e.key === 'Enter' && router.push(`/search/${e.target.value}`)}
          />
        </Container>
        <Group>
          <ThemeButton />
        </Group>
      </div>
    </Header>
  );
}
