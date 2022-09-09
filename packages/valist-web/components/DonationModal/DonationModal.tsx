import { hideLoading, showErrorMessage, showLoading, updateLoading } from '@/forms/utils';
import { tokens } from '@/utils/tokens';
import {
  Stack,
  Title,
  Text,
  Anchor,
} from '@mantine/core';

import { 
  Modal,
  Button,
} from '@valist/ui';
import { ethers } from 'ethers';
import { useState } from 'react';
import { erc20ABI, useContract, useNetwork, usePrepareSendTransaction, useSendTransaction, useSigner } from 'wagmi';
import { getBlockExplorer } from '../Activity';
import { DonationInput } from '../DonationInput';

export interface DonationModalProps {
  opened: boolean;
  projectName: string;
  projectType: string;
  donationAddress: string;
  releaseURL:string;
  onClose: () => void;
}

export function DonationModal(props: DonationModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<number>(0);
  const [hasDonated, setHasDonated] = useState<boolean>(false);

  const { chain } = useNetwork();

  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: tokens[currency]?.address,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  });

  const sendERC20 = async () => {
    try{
      showLoading('Creating transaction');
      const tx = await contract.transfer(props.donationAddress, ethers.utils.parseEther(amount.toString()));
      const message = <Anchor target="_blank"  href={getBlockExplorer(chain?.id || 137, tx.hash)}>Waiting for transaction - View transaction</Anchor>;
      
      await tx.wait();
      updateLoading(message);
      setHasDonated(true);
    } catch (error: any) {
      showErrorMessage(error);
      console.log(error.toString().includes('ERC20: transfer amount exceeds balance'));
    } finally {
      hideLoading();
    }
  };

  const { config } = usePrepareSendTransaction({
    request: { to: props.donationAddress, value: ethers.utils.parseEther(amount.toString()) },
  });

  const { sendTransaction } = useSendTransaction({
    ...config,
    onError(error) {
      showErrorMessage(error);
    },
    onSettled(data) {
      (async () => {
        const message = <Anchor target="_blank"  href={getBlockExplorer(chain?.id || 137, data?.hash || '')}>Waiting for transaction - View transaction</Anchor>;
        showLoading(message);
        setHasDonated(true);

        await data?.wait();
        hideLoading();
      })();
    },
  });

  const donate = async () => {
    if (currency === 0){
      sendTransaction?.();
    } else {
      sendERC20();
    }
  };

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      image="/images/tokens.png"
    >
     {!hasDonated && 
        <Stack>
          <Title>{props.projectType === 'web' ?  'Launch' : 'Download'} {props.projectName}</Title>
          <Text>
            This app is free but is accepting donations. <br/> Please consider supporting the creator by paying what you think is fair.
          </Text>
          <Anchor target="_blank" href={props?.releaseURL || ''} style={{ textDecoration: 'underline' }}>
            No thanks, {props.projectType === 'web' ?  'launch the application.' : 'show me the download.'}
          </Anchor>
          <br/>
          <DonationInput
            currency={currency} 
            setCurrency={setCurrency} 
            onChange={setAmount} 
          />
          <Button onClick={donate}>Donate</Button>
        </Stack>
      }
      {hasDonated && 
        <Stack>
          <Text style={{ fontSize: 35 }}>
            Thankyou for your contribution! ❤️
          </Text>
          <Anchor target="_blank" style={{ fontSize: 35, textDecoration: 'underline' }} href={props?.releaseURL || ''}>
            {props.projectType === 'web' ?  'Launch application.' : 'Download.'}
          </Anchor>
        </Stack>
      }
    </Modal>
  );
}