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
import { AccountModal } from './AccountModal/AccountModal';
import useStyles from './WalletModal.styles';

export interface WalletModalProps {
  accounts: string[];
  value?: string;
  onChange?: (value: string) => void;
  opened: boolean;
  onClose: () => void;
}

export function WalletModal(props: WalletModalProps) {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

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
      <AccountModal
        accounts={props.accounts}
        onChange={props.onChange}
        opened={opened}
        onClose={() => setOpened(false)}
      />
      <Group className={classes.header} position="apart">
        <Group style={{ width: 72 }}>
          <Logo type="sapphire" />
        </Group>
        <UnstyledButton
          onClick={() => setOpened(true)}
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
          <ActionIcon variant="transparent">
            <Icon.Settings />
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