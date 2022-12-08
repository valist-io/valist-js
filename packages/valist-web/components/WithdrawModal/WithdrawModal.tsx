import { useState, useEffect }  from 'react';
import { useAccount } from 'wagmi';
import { Modal, Text, Title, Stack, TextInput } from '@mantine/core';
import { ProductBalance } from '@/components/ProductBalance';
import { Token } from '@/utils/tokens';

export interface WithdrawModalProps {
  tokens: Token[];
  balance: string;
  opened: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (token: string, address: string) => void;
}

export function WithdrawModal(props: WithdrawModalProps) {
  const [recipient, setRecipient] = useState('');
  const { address } = useAccount();

  useEffect(() => {
    setRecipient(address ?? '');
  }, [address]);

  return (
    <Modal
      title="Withdraw"
      opened={props.opened}
      onClose={props.onClose}
      padding={40}
      size={580}
      centered
    >
      <Text size="sm" color="gray.3">
        Select any token that you have funds from sales to withdraw.
      </Text>
      <Stack my={24} p={24}>
        <Text style={{ alignSelf: 'center' }}>
          Balance across all tokens
        </Text>
        <Title style={{ alignSelf: 'center' }}>
          {props.balance}
        </Title>
      </Stack>
      <Stack>
        <Title order={5}>Receiving Address</Title>
        <TextInput 
          label="Address"
          value={recipient} 
          onChange={(event) => setRecipient(event.currentTarget.value)}
        />
        <Title order={5} mt={16}>Tokens</Title>
        { props.tokens.filter(token => token.balance !== 0).map((token: Token, index: number) => 
          <ProductBalance 
            key={index}
            address={token.address}
            balance={token.balance}
            loading={props.loading}
            onSubmit={() => props.onSubmit(token.address, recipient)}
          />,
        )}
      </Stack>
    </Modal>
  );
}