import {
  ActionIcon,
  Group,
  Modal,
  Stack,
  Title,
  Text,
  UnstyledButton,
} from '@mantine/core';

import { useState } from 'react';
import * as Icon from 'tabler-icons-react';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { truncate } from '../Address';
import { CreateModal } from './CreateModal/CreateModal';
import { ImportModal } from './ImportModal/ImportModal';
import { SelectModal } from './SelectModal/SelectModal';
import { SigningModal } from './SigningModal/SigningModal';
import useStyles from './WalletModal.styles';

export interface WalletModalProps {
  accounts: string[];
  value?: string;
  onChange?: (value: string) => void;
  
  opened: boolean;
  loading: boolean;
  onClose: () => void;

  request?: any;
  onApprove: () => void;
  onReject: () => void;

  generate: () => string;
  onCreate: (mnemonic: string) => void;
}

export function WalletModal(props: WalletModalProps) {
  const { classes } = useStyles();
  const [modal, setModal] = useState('');

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      padding={0}
      centered={true}
      zIndex={2147483647}
      withCloseButton={false}
      classNames={{ modal: classes.modal }}
    >
      <SelectModal
        accounts={props.accounts}
        onChange={props.onChange}
        opened={modal === 'select'}
        onClose={() => setModal('')}
        onCreate={() => setModal('create')}
        onImport={() => setModal('import')}
      />
      <SigningModal
        loading={props.loading}
        request={props.request}
        onApprove={props.onApprove}
        onReject={props.onReject}
      />
      <CreateModal
        opened={modal === 'create'}
        onClose={() => setModal('')}
        generate={props.generate}
        onCreate={props.onCreate}
      />
      <ImportModal
        opened={modal === 'import'}
        onClose={() => setModal('')}
        onImport={props.onCreate}
      />
      <Group className={classes.header} position="apart">
        <Group style={{ width: 72 }}>
          <Logo type="sapphire" />
        </Group>
        <UnstyledButton
          onClick={() => setModal('select')}
        >
          <Stack align="center" spacing={0}>
            <Group spacing={9}>
              <Text size={16} color="white">Select Account</Text>
              <Icon.ChevronDown color="white" size={16} />
            </Group>
            { props.value &&
              <Text size={12} color="#CBC9F9">
                { `${truncate(props.value)} (Polygon Network)` }
              </Text>
            }
          </Stack>
        </UnstyledButton>
        <Group>
          <ActionIcon variant="transparent">
            <Icon.Clock />
          </ActionIcon>
          <ActionIcon
            variant="transparent" 
            onClick={props.onClose}
          >
            <Icon.X />
          </ActionIcon>
        </Group>
      </Group>
      <Stack spacing={4} py={24} align="center">
        <Text size={14} color="#CBC9F9">Total Balance</Text>
        <Text size={32} color="white">$0.00</Text>
      </Stack>
      <Stack className={classes.body} spacing={32}>
        <Group grow>
          <Button variant="outline">
            <Text mr={12}>Receive</Text>
            <Icon.Qrcode />
          </Button>
          <Button variant="outline">
            <Text mr={12}>Copy Address</Text>
            <Icon.Copy />
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}