import type { NextPage } from 'next';
import React, { useState, useEffect, useContext } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery } from '@apollo/client';
import * as Icon from 'tabler-icons-react';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
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
} from '@mantine/core';

import { 
  Tabs,
  Button,
} from '@valist/ui';

const zeroAddress = '0x0000000000000000000000000000000000000000';

const Pricing: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 0, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { variables: { projectId } });

  // form values
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [limit, setLimit] = useState(0);
  const [balance, setBalance] = useState(0);
  const [royaltyAmount, setRoyaltyAmount] = useState(0);
  const [royaltyRecipient, setRoyaltyRecipient] = useState('');
  const [withdrawRecipient, setWithdrawRecipient] = useState('');

  const currencies = data?.product?.currencies ?? [];

  const getTokenBalance = (token: string) => {
    const currency = currencies.find(
      (curr: any) => curr.token === token.toLowerCase(),
    );
    return currency?.balance ?? 0;
  };

  const getTokenPrice = (token: string) => {
    const currency = currencies.find(
      (curr: any) => curr.token === token.toLowerCase(),
    );
    return currency?.price ?? 0;
  };

  const updatePrice = () => {
    setLoading(true);
    setProductPrice(
      address,
      projectId,
      price,
      valist,
      cache,
    ).finally(() => {
      setLoading(false);
    });
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

  const updateRoyalty = () => {
    setLoading(true);
    setProductRoyalty(
      address,
      projectId,
      royaltyRecipient,
      royaltyAmount,
      valist,
      cache,
    ).finally(() => {
      setLoading(false);
    });
  };

  const withdrawBalance = () => {
    setLoading(true);
    withdrawProductBalance(
      address,
      projectId,
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
      setLimit(data?.product?.limit ?? 0);
      setPrice(getTokenPrice(zeroAddress));
      setBalance(getTokenBalance(zeroAddress));
      setRoyaltyRecipient(data?.product?.royaltyRecipient ?? '');
      setRoyaltyAmount(data?.product?.royaltyAmount ?? 0);
      setLoading(false);
    }
  }, [data]);

  return (
    <Layout
      breadcrumbs={[
        { title: accountName, href: `/${accountName}` },
        { title: projectName, href: `/${accountName}/${projectName}` },
        { title: 'Pricing', href: `/-/account/${accountName}/project/${projectName}/pricing` },
      ]}
    >
      <Tabs grow>
        <Tabs.Tab label="Pricing">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Pricing</Title>
            <Text color="dimmed">Monetize your game or app with Software License NFTs.</Text>
            <Group>
              <NumberInput
                style={{ flex: '1 1 0px' }}
                label="Price"
                min={0}
                precision={2}
                disabled={loading}
                hideControls
                value={price}
                onChange={val => setPrice(val ?? 0)}
              />
              <Button 
                style={{ height: 44, alignSelf: 'flex-end' }}
                disabled={loading}
                onClick={updatePrice}
              >
                Save
              </Button>
            </Group>
            <Group>
              <NumberInput
                style={{ flex: '1 1 0px' }}
                label="Limit"
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
                Save
              </Button>
            </Group>
          </Stack>
        </Tabs.Tab>
        <Tabs.Tab label="Royalty">
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
        </Tabs.Tab>
        <Tabs.Tab label="Withdraw">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Withdraw</Title>
            <Text color="dimmed">Withdraw funds from product sales.</Text>
            <NumberInput
              label="Balance"
              disabled={true}
              hideControls
              value={balance}
            />
            <TextInput
              label="Recipient"
              placeholder="Address or ENS"
              disabled={loading}
              value={withdrawRecipient}
              onChange={e => setWithdrawRecipient(e.currentTarget.value)}
            />
          </Stack>
          <Group mt="lg">
            <Button 
              onClick={withdrawBalance}
              disabled={loading}
            >
              Withdraw
            </Button>
          </Group>
        </Tabs.Tab>
      </Tabs>
    </Layout>
  );
};

export default Pricing;