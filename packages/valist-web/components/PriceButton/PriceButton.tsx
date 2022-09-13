import { useState } from 'react';
import { EditButton, Item } from '@valist/ui';
import { PriceModal } from '@/components/PriceModal';
import { getTokenSymbol, getTokenLogo } from '@/utils/tokens';

export interface PriceButtonProps {
  address: string;
  price: number;
  loading?: boolean;
  onSubmit: (address: string, price: string) => void;
}

export function PriceButton(props: PriceButtonProps) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <EditButton onClick={() => setOpened(true)} fill>
        <Item 
          label={props.price}
          name={getTokenSymbol(props.address)}
          image={getTokenLogo(props.address)}
        />
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

