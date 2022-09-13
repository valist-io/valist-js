import { useState, useEffect } from 'react';
import { Modal, Stack, Text, NumberInput, TextInput } from '@mantine/core';
import { Button } from '@valist/ui';

export interface RoyaltyModalProps {
  amount: number;
  recipient: string;
  opened: boolean;
  onClose: () => void;
  loading?: boolean;
  onSubmit: (amount: number, recipient: string) => void;
}

export function RoyaltyModal(props: RoyaltyModalProps) {
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    setAmount(props.amount);
    setRecipient(props.recipient);
  }, [props.amount, props.recipient]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit(amount, recipient);
  };

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title="Edit Royalty"
      padding={40}
      size={580}
      centered
    >
      <form onSubmit={submit}>
        <Stack>
          <Text size="sm" color="gray.3">
            Set a royalty percentage for your software and whenever your NFT is resold you get a part of the fee. (NFT Royalty Standard)
          </Text>
          <NumberInput
            label="Percentage"
            min={0}
            max={99.99}
            disabled={props.loading}
            hideControls
            value={amount}
            onChange={val => setAmount(val ?? 0)}
          />
          <TextInput 
            label="Recipient Address"
            value={recipient} 
            onChange={(event) => setRecipient(event.currentTarget.value)}
          />
          <Button 
            style={{ marginTop: 16, alignSelf: 'flex-start' }}
            disabled={props.loading}
            type="submit"
          >
            Save Changes
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}