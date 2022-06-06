import { 
  Navbar, 
  ScrollArea, 
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from './Link';
 
interface Props {
  opened: boolean;
}

export default function SideNav(props: Props): JSX.Element {
	const theme = useMantineTheme();
	const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';

	return (
		<Navbar 
			p="md" 
			hiddenBreakpoint="sm" 
			hidden={!props.opened} 
			width={{ sm: 200, lg: 300 }}
			style={{ backgroundColor }}
		>
			<Navbar.Section grow component={ScrollArea}>
				<Stack>
					<ConnectButton showBalance={false} />
					<Link href="/discover" ml="sm">Discover</Link>
          <Link href="https://valist.io/discord" target="_blank" ml="sm">Discord</Link>
          <Link href="https://docs.valist.io/" target="_blank" ml="sm">Docs</Link>
				</Stack>
      </Navbar.Section>
    </Navbar>
	);
};