import { 
  Navbar,
  Stack,
  Group,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';

import {
	selectAccountNames,
	selectCurrentAccount,
} from '@/features/accounts/accountsSlice';

import * as Icons from 'tabler-icons-react';
import { NextLink } from '@mantine/next';
import AccountPicker from '@/features/accounts/AccountPicker';
import { useAppSelector } from '../../app/hooks';
import Navlink from './Navlink';
import SocialIcons from './SocialIcons';

interface SideNavProps {
  opened: boolean,
}

export default function SideNav(props: SideNavProps): JSX.Element {
	const accountNames = useAppSelector(selectAccountNames);
	const currentAccount = useAppSelector(selectCurrentAccount);

	const theme = useMantineTheme();
	const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';

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
      	<SocialIcons />
    	</Navbar.Section>
    </Navbar>
	);
};