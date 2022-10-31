import type { NextPage } from 'next';
import React, { useState, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import * as Icon from 'tabler-icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useApolloClient, useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { PriceButton } from '@/components/PriceButton';
import { ProductBalance } from '@/components/ProductBalance';
import { TokenModal } from '@/components/TokenModal';
import { LimitModal } from '@/components/LimitModal';
import { RoyaltyModal } from '@/components/RoyaltyModal';
import { WithdrawModal } from '@/components/WithdrawModal';
import { getChainId } from '@/utils/config';
import query from '@/graphql/PricingPage.graphql';

import { 
  formatUnits, 
  getTokenSymbol, 
  getTokenLogo, 
  getTokenPrice,
  tokenAddresses,
  parseUnits,
  Token,
} from '@/utils/tokens';

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
  CopyButton,
  EditButton,
  InfoButton,
  List,
  Member,
  TokenInput,
} from '@valist/ui';

import {
  ActionIcon,
  Anchor,
  Avatar,
  Group,
  Grid,
  Modal,
  NumberInput,
  Select,
  Stack,
  SimpleGrid,
  Text,
  Title,
  TextInput,
  Tabs,
  useMantineTheme,
} from '@mantine/core';
import { BigNumber } from 'ethers';

const Pricing: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const chainId = getChainId();

  const valist = useContext(ValistContext);

  const [tokenOpened, setTokenOpened] = useState(false);
  const [limitOpened, setLimitOpened] = useState(false);
  const [royaltyOpened, setRoyaltyOpened] = useState(false);
  const [withdrawOpened, setWithdrawOpened] = useState(false);

  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { variables: { projectId } });
  const _purchases = data?.product?.purchases ?? [];
  const currencies = data?.product?.currencies ?? [];

  const theme = useMantineTheme();
	const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[4];

  const parseBlockTime = (time: string) => {
    const utc = parseInt(time);
    return new Date(utc * 1000);
  };

  const formatBlockTime = (time: string) => {
    const date = parseBlockTime(time);
    return date.toLocaleString();
  };

  // date ranges
  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth(), 1);
  const week = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [range, setRange] = useState<string | null>('');
  const ranges = [
    { label: 'All Time', value: '' },
    { label: 'This Month', value: `${month.valueOf()}` },
    { label: 'This Week', value: `${week.valueOf()}` },
    { label: 'Today', value: `${today.valueOf()}` },
  ];

  const purchases = _purchases.filter((p: any) => !range || p.blockTime > range);

  // form values
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(0);
  const [royaltyAmount, setRoyaltyAmount] = useState(0);
  const [royaltyRecipient, setRoyaltyRecipient] = useState('');
  const [withdrawRecipient, setWithdrawRecipient] = useState('');

  const [tokens, setTokens] = useState<Token[]>([]);

  const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const usdTotal = usdFormatter.format(tokens.reduce((total, token) => total + token.usd * token.balance, 0));

  const updateLimit = (_limit: number) => {
    setLoading(true);
    setProductLimit(
      address,
      projectId,
      _limit,
      valist,
      cache,
      chainId,
    ).then(success => {
      if (success) setLimit(_limit);
    }).finally(() => {
      setLoading(false);
    });
  };

  const updatePrice = (_token: string, _price: number) => {
    const price = parseUnits(_token, `${_price}`).toString();
    setLoading(true);
    setProductPrice(
      address,
      projectId,
      _token,
      price,
      valist,
      cache,
      chainId,
    ).then(success => {
      if (success) {
        const _tokens = tokens.map(token => 
          token.address === _token ? { ...token, price: _price } : token,
        );
        setTokens(_tokens);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  const updateRoyalty = (_amount: number, _recipient: string) => {
    setLoading(true);
    setProductRoyalty(
      address,
      projectId,
      _recipient,
      _amount * 10000,
      valist,
      cache,
      chainId,
    ).then(success => {
      if (success) {
        setRoyaltyAmount(_amount);
        setRoyaltyRecipient(_recipient);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  const withdrawBalance = (_token: string, _address: string) => {
    setLoading(true);
    withdrawProductBalance(
      address,
      projectId,
      _token,
      _address,
      valist,
      cache,
      chainId,
    ).then(success => {
      if (success) {
        const _tokens = tokens.map(token => 
          token.address === _token ? { ...token, balance: 0 } : token,
        );
        setTokens(_tokens);  
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  // wait for data to load
  useEffect(() => {
    if (data) {
      const _limit = parseInt(data?.product?.limit ?? '0');
      const _royalty = parseInt(data?.product?.royaltyAmount ?? '0');
      const _royaltyRecipient = data?.product?.royaltyRecipient;

      setLimit(_limit);
      setRoyaltyAmount(_royalty / 10000);
      setRoyaltyRecipient(_royaltyRecipient || '0x0000000000000000000000000000000000000000');
      
      const _tokens = tokenAddresses.map(address => {
        const currency = currencies.find((currency: any) => address == currency.token);
        const balance = formatUnits(currency?.token ?? '', currency?.balance ?? '0');
        const price = formatUnits(currency?.token ?? '', currency?.price ?? '0');
        return { address, balance, price, usd: 0, show: !!currency };
      });

      const promises = _tokens.map(
        token => getTokenPrice(token.address).then(usd => ({ ...token, usd })),
      );

      Promise.all(promises)
        .then(setTokens)
        .finally(() => setLoading(false));
    }
  }, [data]);

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
    { title: 'Pricing', href: `/-/account/${accountName}/project/${projectName}/pricing` },
  ];

  return (
    <Layout padding={0}>
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
                        <Text size="xs">{_purchases.length} Lifetime</Text>
                      </Stack>
                    </Group>
                  </Card>
                  <Card padding={16}>
                    <Group align="flex-start" noWrap>
                      <Avatar size={40} radius="xl" src="/images/rocket.svg" />
                      <Stack spacing={0}>
                        <Text size="xs">Total Launches</Text>
                        <Title order={3} mb={4}>0</Title>
                        <Text size="xs">0 Lifetime</Text>
                      </Stack>
                    </Group>
                  </Card>
                  <Card padding={16}>
                    <Group align="flex-start" noWrap>
                      <Avatar size={40} radius="xl" src="/images/royalty.svg" />
                      <Stack spacing={0}>
                        <Text size="xs">Royalty</Text>
                        <Group mb={4}>
                          <Title order={3} >{royaltyAmount}%</Title>
                          <ActionIcon 
                            variant="transparent"
                            onClick={() => setRoyaltyOpened(true)}
                          >
                            <Icon.Edit />
                          </ActionIcon>
                        </Group>
                        <Address size={12} address={royaltyRecipient} truncate />
                      </Stack>
                    </Group>
                  </Card>
                </SimpleGrid>
                <Card>
                  <Stack spacing={32}>
                    <Group position="apart">
                      <Title order={5}>Transaction History</Title>
                      <Select value={range} onChange={setRange} data={ranges} />
                    </Group>
                    <List>
                      { purchases.map((purchase: any, index: number) =>
                        <Group key={index} position="apart" noWrap>
                          <Member member={purchase.sender} truncate />
                          <Text>{formatBlockTime(purchase.blockTime)}</Text>
                          <Group>
                            <Avatar radius="xl" size={40} src={getTokenLogo(purchase.token)} />
                            <Text size="sm">{formatUnits(purchase.token, purchase.price)} {getTokenSymbol(purchase.token)}</Text>
                          </Group>
                        </Group>,
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
                      {usdTotal}
                    </Title>
                    <Button 
                      variant="subtle"
                      onClick={() => setWithdrawOpened(true)}
                    >
                      Withdraw
                    </Button>
                  </Stack>
                </Card>
                <Card>
                  <TextInput
                    id="projectID"
                    name="projectID"
                    label="ProjectIDd for Token Gating"
                    rightSection={<CopyButton value={BigNumber.from(projectId).toString()} />}
                    value={BigNumber.from(projectId).toString()}
                    styles={{
                      disabled: { 
                        borderColor,
                      },
                    }}
                    disabled
                  />
                </Card>
                <Card>
                  <Group position="apart" noWrap>
                    <Text>Prices</Text>
                    <Button variant="text" onClick={() => setTokenOpened(true)}>
                      Add Price
                    </Button>
                  </Group>
                  <Stack>
                    <EditButton onClick={() => setLimitOpened(true)}>
                      <Text size="sm">Max License Limit: {limit === 0 ? 'Unlimited' : limit}</Text>
                    </EditButton>
                    { tokens.filter(token => token.show).map((token: Token, index: number) =>
                      <PriceButton 
                        key={index}
                        address={token.address}
                        price={token.price}
                        loading={loading}
                        onSubmit={updatePrice}
                      />,
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          }
        </Grid>
      </div>
      <TokenModal
        values={tokens}
        onChange={setTokens}
        opened={tokenOpened} 
        onClose={() => setTokenOpened(false)} 
      />
      <WithdrawModal
        tokens={tokens}
        balance={usdTotal}
        opened={withdrawOpened}
        onClose={() => setWithdrawOpened(false)}
        onSubmit={withdrawBalance}
      />
      <LimitModal
        value={limit}
        loading={loading}
        opened={limitOpened}
        onClose={() => setLimitOpened(false)}
        onSubmit={updateLimit}
      />
      <RoyaltyModal
        amount={royaltyAmount}
        recipient={royaltyRecipient}
        loading={loading}
        opened={royaltyOpened}
        onClose={() => setRoyaltyOpened(false)}
        onSubmit={updateRoyalty}
      />
    </Layout>
  );
};

export default Pricing;