import type { NextPage } from 'next';
import React, { useState, useEffect, useContext } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { useApolloClient, useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { ProductPrice } from '@/components/ProductPrice';
import { ProductBalance } from '@/components/ProductBalance';
import { TokenModal } from '@/components/TokenModal';
import { formatUnits, getTokenSymbol, getTokenLogo } from '@/utils/tokens';
import query from '@/graphql/PricingPage.graphql';

import {
  setProductRoyalty,
  setProductLimit,
  setProductPrice,
  withdrawProductBalance,
} from '@/forms/update-product';

import {
  Address,
  Breadcrumbs,
  Button,
  Card,
  EditButton,
  InfoButton,
  Item,
  List,
  Member,
  TokenInput,
} from '@valist/ui';

import {
  Anchor,
  Avatar,
  Group,
  Grid,
  NumberInput,
  Stack,
  SimpleGrid,
  Text,
  Title,
  TextInput,
  Textarea,
} from '@mantine/core';

const Pricing: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const valist = useContext(ValistContext);

  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id || 137, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { variables: { projectId } });
  const purchases = data?.product?.purchases ?? [];

  // form values
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(0);
  const [royaltyAmount, setRoyaltyAmount] = useState(0);
  const [royaltyRecipient, setRoyaltyRecipient] = useState('');
  const [withdrawRecipient, setWithdrawRecipient] = useState('');

  const [tokens, setTokens] = useState<string[]>([]);
  const [tokenOpened, setTokenOpened] = useState(false);
  const currencies = data?.product?.currencies ?? [];

  const getCurrency = (address: string) => currencies.find(
    (curr: any) => curr.token?.toLowerCase() === address.toLowerCase(),
  );

  const getCurrencyBalance = (address: string) => {
    const currency = getCurrency(address);
    return formatUnits(address, currency?.balance ?? '0');
  };

  const getCurrencyPrice = (address: string) => {
    const currency = getCurrency(address);
    return formatUnits(address, currency?.price ?? '0');
  };

  const parseBlockTime = (time: string) => {
    const utc = parseInt(time);
    return new Date(utc * 1000);
  };

  const formatBlockTime = (time: string) => {
    const date = parseBlockTime(time);
    return date.toLocaleString();
  }

  const updateLimit = () => {
    setLoading(true);
    setProductLimit(
      address,
      projectId,
      limit,
      valist,
      cache,
      chain?.id || 137,
    ).finally(() => {
      setLoading(false);
    });
  };

  const updatePrice = (token: string, price: string) => {
    setLoading(true);
    setProductPrice(
      address,
      projectId,
      token,
      price,
      valist,
      cache,
      chain?.id || 137,
    ).finally(() => {
      setLoading(false);
    });
  };

  const updateRoyalty = () => {
    setLoading(true);
    setProductRoyalty(
      address,
      projectId,
      royaltyRecipient,
      royaltyAmount * 10000,
      valist,
      cache,
      chain?.id || 137,
    ).finally(() => {
      setLoading(false);
    });
  };

  const withdrawBalance = (token: string) => {
    setLoading(true);
    withdrawProductBalance(
      address,
      projectId,
      token,
      withdrawRecipient,
      valist,
      cache,
      chain?.id || 137,
    ).finally(() => {
      setLoading(false);
    });
  };

  // wait for data to load
  useEffect(() => {
    if (data) {
      const _limit = parseInt(data?.product?.limit ?? '0');
      const _royalty = parseInt(data?.product?.royaltyAmount ?? '0');

      setLimit(_limit);
      setRoyaltyAmount(_royalty / 10000);
      setRoyaltyRecipient(data?.product?.royaltyRecipient || '0x0000000000000000000000000000000000000000');
      setTokens(currencies.map((currency: any) => currency.token));
      setLoading(false);
    }
  }, [data]);

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
    { title: 'Pricing', href: `/-/account/${accountName}/project/${projectName}/pricing` },
  ];

  return (
    <Layout padding={0}>
      <TokenModal
        values={tokens}
        onChange={setTokens}
        opened={tokenOpened} 
        onClose={() => setTokenOpened(false)} 
      />
      <Group mt={40} pl={40} position="apart">
        <Breadcrumbs items={breadcrumbs} />
        { showInfo &&
          <InfoButton 
            opened={infoOpened}
            onClick={() => setInfoOpened(!infoOpened)} 
          />
        }
      </Group>
      <div style={{ padding: 40 }}>
        <Title mb="xl">Pricing & Finance</Title>
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
              <Stack spacing={24}>
                <SimpleGrid
                  breakpoints={[
                    { minWidth: 'sm', cols: 1, spacing: 24 },
                    { minWidth: 'md', cols: 2, spacing: 24 },
                    { minWidth: 'lg', cols: 3, spacing: 24 },
                  ]}
                >
                  <Card padding={16}>
                    <Group align="flex-start" noWrap>
                      <Avatar size={40} radius="xl" src="/images/shopping_cart.svg" />
                      <Stack spacing={0}>
                        <Text size="xs">Total Sales</Text>
                        <Title order={3} mb={4}>{purchases.length}</Title>
                        <Text size="xs">{`+0% > last month`}</Text>
                      </Stack>
                    </Group>
                  </Card>
                  { /*<Card padding={16}>
                    <Group align="flex-start" noWrap>
                      <Avatar size={40} radius="xl" src="/images/rocket.svg" />
                      <Stack spacing={0}>
                        <Text size="xs">Total Launches</Text>
                        <Title order={3} mb={4}>0</Title>
                        <Text size="xs">{`+0% > last month`}</Text>
                      </Stack>
                    </Group>
                  </Card> */ }
                  <Card padding={16}>
                    <Group align="flex-start" noWrap>
                      <Avatar size={40} radius="xl" src="/images/royalty.svg" />
                      <Stack spacing={0}>
                        <Text size="xs">Royalty</Text>
                        <Title order={3} mb={4}>{royaltyAmount}%</Title>
                        <Address size={12} address={royaltyRecipient} truncate />
                      </Stack>
                    </Group>
                  </Card>
                </SimpleGrid>
                <Card>
                  <Stack spacing={32}>
                    <Title order={5}>Transaction History</Title>
                    <List>
                      { purchases.map((purchase: any, index: number) =>
                        <Group key={index} position="apart" noWrap>
                          <Member member={purchase.sender} truncate />
                          <Text>{formatBlockTime(purchase.blockTime)}</Text>
                          <Group>
                            <Avatar radius="xl" size={40} src={getTokenLogo(purchase.token)} />
                            <Text size="sm">{formatUnits(purchase.token, purchase.price)} {getTokenSymbol(purchase.token)}</Text>
                          </Group>
                        </Group>
                      )}
                    </List>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          }
          { (!showInfo || infoOpened) &&
            <Grid.Col xl={4}>
              <Stack spacing={24}>
                <Card>
                  <Stack>
                    <Text style={{ alignSelf: 'center' }}>
                      Balance across all tokens
                    </Text>
                    <Title style={{ alignSelf: 'center' }}>
                      $0.00
                    </Title>
                    <Button variant="subtle">Withdraw</Button>
                  </Stack>
                </Card>
                <Card>
                  <Group position="apart" noWrap>
                    <Text>Prices</Text>
                    <Button variant="text" onClick={() => setTokenOpened(true)}>
                      Add Price
                    </Button>
                  </Group>
                  <Stack>
                    <EditButton>
                      <Text size="sm">Max License Limit: {limit === 0 ? 'Unlimited' : limit}</Text>
                    </EditButton>
                    { tokens.map((address: string, index: number) =>
                      <EditButton key={index} fill>
                        <Item 
                          name={getTokenSymbol(address)}
                          label={getCurrencyBalance(address)}
                          image={getTokenLogo(address)}
                        />
                      </EditButton>
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          }
        </Grid>
      </div>
    </Layout>
  );
};

export default Pricing;