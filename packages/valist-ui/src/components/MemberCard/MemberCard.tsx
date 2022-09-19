import {
  Anchor,
  Stack,
  Group,
  Text,
  Tooltip,
} from '@mantine/core';

import { Address } from '../Address';
import { Card } from '../Card';
import { Identicon } from '../Identicon';

export interface MemberCardProps {
  address: string;
  accounts: string[];
}

export function MemberCard(props: MemberCardProps) {
  return (
    <Card padding={40}>
      <Stack justify="center" align="center">
        <Identicon value={props.address} size={100} />
        <Address address={props.address} size={24} truncate />
        <Group spacing={4} noWrap>
          { props.accounts.slice(0, 2).map((account: any, index: number) => 
            <Anchor href={`/${account.name}`} size="sm">
              {account.name}{index != props.accounts.length - 1 && ','}
            </Anchor>
          )}
          { props.accounts.length > 2 &&
            <Tooltip label={props.accounts.slice(2).map((a: any) => a.name).join(', ')}>
              <Text size="sm">
                {props.accounts.length - 2} more
              </Text>
            </Tooltip>
          }
        </Group>
      </Stack>
    </Card>
  );
}