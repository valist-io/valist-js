import { 
  Navbar,
  Stack,
  Group,
  MediaQuery,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';

import {
	selectAccountNames,
	selectCurrentAccount,
} from '@/features/accounts/accountsSlice';

import { useEffect } from 'react';
import * as Icons from 'tabler-icons-react';
import { NextLink } from '@mantine/next';
import AccountPicker from '@/features/accounts/AccountPicker';
import { useAppSelector } from '../../app/hooks';
import Navlink from './Navlink';

interface SideNavProps {
  opened: boolean,
}

export default function SideNav(props: SideNavProps): JSX.Element {
	const accountNames = useAppSelector(selectAccountNames);
	const currentAccount = useAppSelector(selectCurrentAccount);

	const theme = useMantineTheme();
	const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';
	const linkColor = theme.colorScheme === 'dark' ? 'white' : theme.colors.gray[6];

	return (
		<Navbar 
			hiddenBreakpoint="sm" 
			hidden={!props.opened} 
			width={{ sm: 250 }}
			style={{ backgroundColor }}
		>
			<Navbar.Section px={30} py="md" mt="md">
				{ accountNames.length > 0 &&
					<AccountPicker accountNames={accountNames} /> 
				}
			</Navbar.Section>
			<Navbar.Section grow>
				{ currentAccount &&
					<Stack spacing={0}>
						<Navlink 
							icon={Icons.Apps} 
							text="Dashboard" 
							href="/" />
						<Navlink 
							icon={Icons.Settings}
							text="Settings" 
							href={`/edit/account?name=${currentAccount}`} />
					</Stack>
				}
      </Navbar.Section>
      <Navbar.Section px={30} py="md">
      	<Group spacing="lg">
					<ActionIcon 
						variant="transparent" 
						component={NextLink}
						target="_blank" 
            href="https://valist.io/discord"
					>
						<Icons.BrandDiscord color={linkColor} size={48} strokeWidth={2} />
					</ActionIcon>
					<ActionIcon 
						variant="transparent"
						component={NextLink}
						target="_blank" 
            href="https://twitter.com/Valist_io"
					>
						<Icons.BrandTwitter color={linkColor} size={48} strokeWidth={2} />
					</ActionIcon>
					<ActionIcon 
						variant="transparent"
						component={NextLink}
						target="_blank" 
            href="https://github.com/valist-io"
					>
						<Icons.BrandGithub color={linkColor} size={48} strokeWidth={2} />
					</ActionIcon>
	      </Group>
    	</Navbar.Section>
    </Navbar>
	);
};