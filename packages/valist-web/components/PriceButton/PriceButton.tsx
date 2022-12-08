import { useState } from 'react';
import { EditButton } from '@valist/ui';
import { PriceModal } from '@/components/PriceModal';
import { getTokenSymbol, getTokenLogo } from '@/utils/tokens';
import { Avatar, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';

export interface PriceButtonProps {
  address: string;
  price: number;
  loading?: boolean;
  onSubmit: (address: string, price: number) => void;
}

export function PriceButton(props: PriceButtonProps) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const color = theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[4];

  return (
    <>
      <EditButton onClick={() => setOpened(true)} fill>
        <Group>
          <Avatar 
            radius="xl"
            size={40} 
            src={getTokenLogo(props.address)} 
          />
          <Stack spacing={0}>
            <Title 
              order={5}
              style={{ color }}
            >
              {getTokenSymbol(props.address)}
            </Title>
            <Text 
              size={'xs'}
              style={{ color }}
            >
              {`${props.price}`}
            </Text>
          </Stack>
        </Group>
      </EditButton>
      <PriceModal
        address={props.address}
        price={props.price}
        loading={props.loading}
        onSubmit={props.onSubmit}
        opened={opened}
        onClose={() => setOpened(false)}
      />
    </>
  );
}
