import {
  Stack,
  Title,
  Text,
  NumberInput,
  Anchor,
} from '@mantine/core';

import { 
  Modal,
  Button,
} from '@valist/ui';
import { BigNumber, ethers } from 'ethers';
import { useState } from 'react';
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi';

export interface DonationModalProps {
  opened: boolean;
  projectName: string;
  donationAddress: string;
  releaseURL:string;
  onClose: () => void;
}

export function DonationModal(props: DonationModalProps) {
  const [amount, setAmount] = useState<number>(0);

  console.log('props.donationAddress', props.donationAddress);
  const { config } = usePrepareSendTransaction({
    request: { to: props.donationAddress, value: ethers.utils.parseEther(amount.toString()) },
  });

  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(config);

  const donate = () => {
    console.log('data, isLoading, isSuccess, sendTransaction', data, isLoading, isSuccess, sendTransaction);
    sendTransaction?.();
  };

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      image="/images/tokens.png"
    >
      <Stack>
        <Title>Download {props.projectName}</Title>
        <Text>
          This app is free but is accepting donations. <br/> Please consider supporting the creator by paying what you think is fair.
        </Text>
        <Anchor href={props?.releaseURL || ''} style={{ textDecoration: 'underline' }}>
          No thanks, show me the download.
        </Anchor>
        <br/>
        <NumberInput
          label="Polygon Amount"
          placeholder='2.0'
          onChange={(value) => setAmount(value || 0)}
          min={0}
          precision={4}
          hideControls
        />
        <Button onClick={donate}>Donate</Button>
      </Stack>
    </Modal>
  );
}