import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { NextLink } from '@mantine/next';
import { useQuery, useApolloClient } from '@apollo/client';
import { ValistContext } from '@/components/ValistProvider';
import { purchaseProduct } from '@/forms/purchase';
import query from '@/graphql/Purchase.graphql';

import {
  Title,
  Group,
} from '@mantine/core';

import {
  Button,
  Card,
} from '@valist/ui';

export interface PurchaseProps {
  projectId: string;
  name: string;
  href: string;
}

export function Purchase(props: PurchaseProps) {
  const { projectId } = props;
  const { address } = useAccount();
  const { cache } = useApolloClient();
  const valist = useContext(ValistContext);

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data } = useQuery(query, { 
    variables: { projectId }, 
  });

  // update balance when address or projectId changes
  useEffect(() => {
    if (address) {
      valist.getProductBalance(address, projectId)
        .catch(_err => setBalance(0))
        .then(value => setBalance(value?.toNumber() ?? 0));  
    }
  }, [address, projectId]);

  const supply = data?.product?.supply ?? 0;
  const limit = data?.product?.limit ?? 0;

  // TODO add support for erc20 tokens
  const currency = data?.product?.find(
    (curr: any) => curr.token === '0x0000000000000000000000000000000000000000',
  );

  const price = currency?.price ?? 0;

  const purchase = () => {
    setLoading(true);
    purchaseProduct(
      address,
      projectId,
      valist,
      cache,
    ).then(success => {
      if (success) setBalance(1);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Card>
      <Group position="apart">
        { (price > 0 && balance === 0) &&
          <>
            <Title order={2}>Purchase {props.name}</Title>
            <Button
              disabled={loading} 
              onClick={purchase}
            >
              Purchase
            </Button>
          </>
        }
        { (price === 0 || balance > 0) &&
          <>
            <Title order={2}>Launch {props.name}</Title>
            <NextLink target="_blank" href={props.href}>
              <Button>Launch</Button>
            </NextLink>
          </>
        }
      </Group>
    </Card>
  );
}