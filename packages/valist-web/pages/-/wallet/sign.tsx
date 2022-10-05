import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { 
  Group,
  Stack,
  Text,
} from '@mantine/core';

import {
  Button,
} from '@valist/ui';

declare global {
  interface Window {
    ethereum: any;
  }
}

const SignPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<any>();

  useEffect(() => {
    window?.ethereum?.request({ method: 'wallet_signingRequest' }).then(setRequest);
  }, []);

  const approveSigning = () => {
    setLoading(true);
    window?.ethereum?.request({ method: 'wallet_approveSigning' })
      .finally(() => setLoading(false));
  };

  const rejectSigning = () => {
    setLoading(true);
    window?.ethereum?.request({ method: 'wallet_rejectSigning' })
      .finally(() => setLoading(false));
  };

  return (
    <Stack p={40}>
      <Text>Sign</Text>
      <Text>{ request?.type }</Text>
      <Text><pre>{ JSON.stringify(request?.data ?? '', null, '\t') }</pre></Text>
      <Group>
        <Button 
          disabled={loading} 
          onClick={rejectSigning} 
          variant="secondary"
        >
          Reject
        </Button>
        <Button 
          disabled={loading} 
          onClick={approveSigning}
        >
          Approve
        </Button>
      </Group>
    </Stack>
  );
}

export default SignPage;