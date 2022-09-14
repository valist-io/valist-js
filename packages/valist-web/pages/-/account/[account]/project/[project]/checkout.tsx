import type { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { useQuery, useApolloClient } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { purchaseProduct } from '@/forms/purchase';
import { findToken, formatUnits } from '@/utils/tokens';
import query from '@/graphql/ProjectPage.graphql';

import {
  Address,
  Button,
  Breadcrumbs,
  Card,
  Divider,
  Item,
  List,
  RadioCard,
} from '@valist/ui';

import {
  Avatar,
  Group,
  Grid,
  Stack,
  Title,
  Text,
  TextInput,
} from '@mantine/core';

const Checkout: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [loading, setLoading] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [payment, setPayment] = useState(0);

  const valist = useContext(ValistContext);

  useEffect(() => {
    if (isGift) {
      setRecipient('');
    } else {
      setRecipient(address ?? '');
    }
  }, [isGift, address]);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id || 137, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { variables: { projectId } });
  const { data: projectMeta } = useSWRImmutable(data?.project?.metaURI);

  const supply = data?.product?.supply ?? 0;
  const limit = data?.product?.limit ?? 0;
  const currencies = data?.product?.currencies ?? [];

  const tokens = currencies.map((curr: any) => {
    const price = formatUnits(curr.token, curr.price);
    const token = findToken(curr.token);
    return { ...token, price };
  });

  const purchase = () => {
    const _token = tokens[payment].address;

    setLoading(true);
    purchaseProduct(
      recipient,
      projectId,
      _token,
      valist,
      cache,
    ).then(success => {
      if (success) router.push(`/${accountName}/${projectName}`);
    }).finally(() => {
      setLoading(false);
    });
  };

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
    { title: 'Checkout', href: `/-/account/${accountName}/project/${projectName}/checkout` },
  ];

  return (
    <Layout padding={0}>
      <Group mt={40} pl={40} position="apart">
        <Breadcrumbs items={breadcrumbs} />
      </Group>
      <div style={{ padding: 40 }}>
        <Grid>
          <Grid.Col xl={8}>
            <Stack>
              <Group spacing={24}>
                <Avatar 
                  radius="md"
                  size={92} 
                  src={projectMeta?.image} 
                />
                <Stack spacing={0}>
                  <Title order={3}>{projectName}</Title>
                  <Text>{projectMeta?.name}</Text>
                </Stack>
              </Group>
              <Divider style={{ margin: '24px 0' }} />
              <Title>Receiving Address</Title>
              <Text mb={8}>This is the address that will own the Software License.</Text>
              <RadioCard
                label="For Myself"
                checked={!isGift}
                onChange={() => setIsGift(false)}
                disabled={loading}
              />
              <RadioCard
                label="For an External Address"
                checked={isGift}
                onChange={() => setIsGift(true)}
                disabled={loading}
              >
                <TextInput 
                  label="Address" 
                  value={recipient} 
                  onChange={(event) => setRecipient(event.currentTarget.value)} 
                />
              </RadioCard>
              <Title mt={24} mb={8}>Payment Options</Title>
              { tokens.map((token: any, index: number) =>
                <RadioCard
                  key={index}
                  label={<Item name={token.symbol} label={token.name} image={token.logoURI} />}
                  rightLabel={token.price}
                  checked={index === payment}
                  onChange={() => setPayment(index)}
                  disabled={loading}
                />,
              )}
            </Stack>
          </Grid.Col>
          <Grid.Col xl={4}>
            <Card>
              <Stack spacing={24}>
                <Title order={5}>Summary</Title>
                <List>
                  <Group position="apart">
                    <Text>Recipient</Text>
                    <Address address={recipient ?? ''} truncate />
                  </Group>
                  <Group position="apart">
                    <Text>Payment</Text>
                    <Text>{ tokens?.[payment]?.symbol }</Text>
                  </Group>
                  <Group position="apart">
                    <Text>Amount</Text>
                    <Text>{ tokens?.[payment]?.price }</Text>
                  </Group>
                </List>
                <Button 
                  onClick={() => purchase()}
                  style={{ marginTop: 16 }}
                  disabled={loading}
                >
                  Confirm Payment
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </div>
    </Layout>
  );
};

export default Checkout;