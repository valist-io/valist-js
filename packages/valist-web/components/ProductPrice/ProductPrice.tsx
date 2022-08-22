import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Group } from '@mantine/core';
import { Button, TokenInput } from '@valist/ui';
import { tokens } from '@/utils/tokens';

export interface ProductPriceProps {
  address: string;
  price: number;
  loading?: boolean;
  onSubmit: (address: string, price: string) => void;
}

export function ProductPrice(props: ProductPriceProps) {
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
    <form onSubmit={submit}>
      <Group>
        <TokenInput
          style={{ flex: '1 1 0px' }}
          label={label}
          icon={icon}
          decimals={decimals}
          value={props.price}
          onChange={setPrice}
          disabled={props.loading}
        />
        <Button 
          style={{ height: 44, alignSelf: 'flex-end' }}
          disabled={props.loading}
          type="submit"
        >
          Set Price
        </Button>
      </Group>
    </form>
  );
}