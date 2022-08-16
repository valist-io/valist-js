import type { NextPage } from 'next';
import React, { useState, useEffect, useContext } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery } from '@apollo/client';
import * as Icon from 'tabler-icons-react';
import { Breadcrumbs, Button, TokenInput } from '@valist/ui';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { ProductPrice } from '@/components/ProductPrice';
import { ProductBalance } from '@/components/ProductBalance';
import { TokenModal } from '@/components/TokenModal';
import { formatUnits } from '@/utils/tokens';
import query from '@/graphql/PricingPage.graphql';

import {
  setProductRoyalty,
  setProductLimit,
  setProductPrice,
  withdrawProductBalance,
} from '@/forms/update-product';

import {
  Anchor,
  Group,
  Text,
  Title,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  List,
  Tabs,
} from '@mantine/core';

const Pricing: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 137, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { variables: { projectId } });

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

  const updateLimit = () => {
    setLoading(true);
    setProductLimit(
      address,
      projectId,
      limit,
      valist,
      cache,
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
      setRoyaltyRecipient(data?.product?.royaltyRecipient ?? '');
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
    <Layout>
      <TokenModal
        values={tokens}
        onChange={setTokens}
        opened={tokenOpened} 
        onClose={() => setTokenOpened(false)} 
      />
      <div style={{ paddingBottom: 32 }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Tabs defaultValue="pricing">
        <Tabs.List grow>
          <Tabs.Tab value="pricing">Pricing</Tabs.Tab>
          <Tabs.Tab value="royalty">Royalty</Tabs.Tab>
          <Tabs.Tab value="withdraw">Withdraw</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="pricing">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Pricing</Title>
            <Text color="dimmed">Monetize your game or app with Software License NFTs.</Text>
            <Group>
              <NumberInput
                style={{ flex: '1 1 0px' }}
                label="Max License Limit"
                min={0}
                disabled={loading}
                hideControls
                value={limit}
                onChange={val => setLimit(val ?? 0)}
              />
              <Button 
                style={{ height: 44, alignSelf: 'flex-end' }}
                disabled={loading}
                onClick={updateLimit}
              >
                Set Limit
              </Button>
            </Group>
            { tokens.map((address: string, index: number) => 
              <ProductPrice 
                key={index}
                address={address}
                loading={loading}
                price={getCurrencyPrice(address)}
                onSubmit={updatePrice}
              />,
            )}
            <div>
              <Button 
                variant="subtle" 
                onClick={() => setTokenOpened(true)}
              >
                Add Currency
              </Button>
            </div>
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="royalty">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Royalty</Title>
            <Text color="dimmed">
              Add support for <Anchor href="https://eips.ethereum.org/EIPS/eip-2981" target="_blank">EIP-2981: NFT Royalty Standard.</Anchor>
            </Text>
            <NumberInput
              label="Percent"
              min={0}
              max={99.99}
              precision={2}
              disabled={loading}
              value={royaltyAmount}
              onChange={val => setRoyaltyAmount(val ?? 0)}
              hideControls
            />
            <TextInput
              label="Address"
              placeholder="Address or ENS"
              disabled={loading}
              value={royaltyRecipient}
              onChange={e => setRoyaltyRecipient(e.currentTarget.value)}
            />
          </Stack>
          <Group mt="lg">
            <Button 
              onClick={updateRoyalty} 
              disabled={loading}
            >
              Save
            </Button>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="withdraw">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Withdraw</Title>
            <Text color="dimmed">Withdraw funds from product sales.</Text>
            <TextInput
              label="Recipient"
              placeholder="Address or ENS"
              disabled={loading}
              value={withdrawRecipient}
              onChange={e => setWithdrawRecipient(e.currentTarget.value)}
            />
            { tokens.map((address: string, index: number) => 
              <ProductBalance 
                key={index}
                address={address}
                balance={getCurrencyBalance(address)}
                loading={loading}
                onSubmit={withdrawBalance}
              />,
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Layout>
  );
};

export default Pricing;