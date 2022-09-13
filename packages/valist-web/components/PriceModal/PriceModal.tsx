import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Modal, Stack, Text } from '@mantine/core';
import { Button, TokenInput, Item } from '@valist/ui';
import { tokens } from '@/utils/tokens';

export interface PriceModalProps {
  address: string;
  price: number;
  loading?: boolean;
  opened: boolean;
  onClose: () => void;
  onSubmit: (address: string, price: string) => void;
}

export function PriceModal(props: PriceModalProps) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    setPrice(props.price);
  }, [props.price]);

  const token = tokens.find(
    (token: any) => token.address?.toLowerCase() === props.address.toLowerCase(),
  );

  const decimals = token?.decimals ?? 18;
  const label = token?.name ?? '';
  const icon = token?.logoURI ?? '';

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = ethers.utils.parseUnits(`${price}`, decimals);
    props.onSubmit(props.address, value.toString());
  };

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title="Edit Price"
      padding={40}
      size={580}
      centered
    >
      <form onSubmit={submit}>
        <Stack>
          <Text size="sm" color="gray.3">
            Set the price for your software in this token currency.
          </Text>
          <Item 
            label={token.name}
            name={token.symbol}
            image={token.logoURI}
          />
          <TokenInput
            style={{ flex: '1 1 0px' }}
            label="Price"
            icon={icon}
            decimals={decimals}
            value={props.price}
            onChange={setPrice}
            disabled={props.loading}
          />
          <Button 
            style={{ marginTop: 16, alignSelf: 'flex-start' }}
            disabled={props.loading}
            type="submit"
          >
            Set Price
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}