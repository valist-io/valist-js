import { Group } from '@mantine/core';
import { Button, TokenInput } from '@valist/ui';
import { tokens } from '@/utils/tokens';

export interface ProductBalanceProps {
  address: string;
  balance: number;
  loading?: boolean;
  onSubmit: () => void;
}

export function ProductBalance(props: ProductBalanceProps) {
  const token = tokens.find(
    (token: any) => token.address?.toLowerCase() === props.address.toLowerCase(),
  );

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit();
  };

  return (
    <form onSubmit={submit}>
      <Group>
        <TokenInput
          style={{ flex: '1 1 0px' }}
          label={token?.name ?? ''}
          icon={token?.logoURI ?? ''}
          decimals={token?.decimals ?? 18}
          value={props.balance}
          disabled
        />
        <Button 
          style={{ height: 44, alignSelf: 'flex-end' }}
          disabled={props.loading}
          type="submit"
        >
          Withdraw
        </Button>
      </Group>
    </form>
  );
}