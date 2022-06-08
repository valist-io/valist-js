import { Menu, Button } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import Link from 'next/link';

interface CreateButtonProps {
  transactions: string[]
  accountName: string;
}

export default function CreateButton(props: CreateButtonProps) {
  const colorScheme = useColorScheme();
  
  return (
    <Menu style={{ borderRadius: '8px' }} control={<Button fullWidth variant="outline" color={colorScheme === 'dark' ? 'gray' : 'dark' }>Create New</Button>}>
       {props.transactions.map((transaction) => (
        <Link key={transaction} href={`/create/${transaction.toLowerCase()}` + ((transaction === 'Project') ? `?account=${props.accountName}` : ``)}>
          <Menu.Item component="a">
            {transaction}
          </Menu.Item>
        </Link>
       ))}
    </Menu>
  );
}