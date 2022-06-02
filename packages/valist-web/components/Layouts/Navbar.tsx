import { useEffect, useState } from 'react';
import { 
  Navbar, 
  ScrollArea, 
  Stack,
  Text,
  useMantineTheme 
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useQuery } from '@apollo/client';
import { useAppSelector } from '../../app/hooks';
import { selectAddress } from '../../features/accounts/accountsSlice';
import { truncate } from '../../utils/Formatting/truncate';
import { USER_HOMEPAGE } from '../../utils/Apollo/queries';
import Link from './Link';
 
interface Props {
  opened: boolean;
}

export default function(props: Props): JSX.Element {
	const theme = useMantineTheme();
	const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';

	const address = useAppSelector(selectAddress);
	const { data } = useQuery(USER_HOMEPAGE, {
		variables: { address: address.toLowerCase() },
	});

	const [accounts, setAccounts] = useState([]);
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		let accountMap = new Map();
		let projectMap = new Map();

		if (data && data.users) {
			data.users[0].projects?.forEach(p => {
				projectMap.set(p.id, p);
			});

			data.users[0].accounts?.forEach(a => {
				accountMap.set(a.id, a);
			});

			data.users[0].accounts?.flatMap(a => a.projects).forEach(p => {
				projectMap.set(p.id, p);
			});
		}

		setAccounts([...accountMap.values()]);
		setProjects([...projectMap.values()]);
	}, [data]);

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
					<Link href="/discover" ml="sm">Discover</Link>
          <Link href="https://valist.io/discord" ml="sm">Discord</Link>
          <Link href="https://docs.valist.io/" ml="sm">Docs</Link>
					<Text color="dimmed">Projects</Text>
					{ projects.map(p => 
						<Link key={p.id} href={`/${p.account.name}/${p.name}`} ml="sm">{p.name}</Link>
					)}
					<Text color="dimmed">Accounts</Text>
					{ accounts.map(a => 
						<Link key={a.id} href={`/${a.name}`} ml="sm">{a.name}</Link>
					)}
				</Stack>
      </Navbar.Section>
			<Navbar.Section>
				<Text>{ truncate(address, 8) }</Text>
			</Navbar.Section>
    </Navbar>
	);
}