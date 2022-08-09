import type { NextPage } from 'next';
import { useState } from 'react';
import { useContractRead, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { Button } from '@valist/ui';
import { Layout } from '@/components/Layout';

import { 
  paymasterAddress, 
  paymasterABI,
  deposit,
} from '@/forms/opengsn';

import { 
  TextInput,
  NumberInput,
  Title,
  Text,
  Stack,
  Group,
} from '@mantine/core';

const GasTank: NextPage = () => {
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(2);

  const { data, error } = useContractRead({
    addressOrName: paymasterAddress,
    contractInterface: paymasterABI,
    functionName: 'getRelayHubDeposit',
  });

  const submit = () => {
    setLoading(true);
    const value = ethers.utils.parseUnits(`${amount || 0}`);
    deposit(value, signer).finally(() => setLoading(false));
  };

  return (
    <Layout>
      <Stack style={{ maxWidth: 784 }}>
        <Title mt="lg">Gas Tank</Title>
        <Text color="dimmed">Valist uses OpenGSN to cover your gas fees.</Text>
        <TextInput
          label="Balance"
          error={error as any}
          value={ethers.utils.formatUnits(`${data || 0}`)} 
          disabled
        />
        <NumberInput
          label="Amount"
          precision={18}
          value={amount} 
          onChange={val => setAmount(val ?? 0)} 
          disabled={loading}
          hideControls
        />
        <Group>
          <Button
            disabled={loading}
            onClick={submit}
          >
            Deposit
          </Button>
        </Group>
      </Stack>
    </Layout>
  );
};

export default GasTank;