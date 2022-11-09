import {
  Group,
  Modal,
  Stack,
  UnstyledButton,
} from '@mantine/core';

import { Member } from '../../Member';
import { Button } from '../../Button';
import useStyles from './AccountModal.styles';

export interface AccountModalProps {
  accounts: string[];
  onChange?: (value: string) => void;

  opened: boolean;
  onClose: () => void;
}

export function AccountModal(props: AccountModalProps) {
  const { classes } = useStyles();

  const select = (acc: string) => {
    props.onChange?.(acc);
    props.onClose();
  };

  return (
    <Modal
      radius={16}
      centered={true}
      zIndex={2147483648}
      opened={props.opened}
      onClose={props.onClose}
      withCloseButton={false}
    >
      <Stack mb={40}>
        {props.accounts.map((acc, idx) =>
          <UnstyledButton 
            key={idx} 
            className={classes.button}
            onClick={() => select(acc)}
          >
            <Member member={acc} truncate />
          </UnstyledButton>
        )}
      </Stack>
      <Group grow>
        <Button
          variant="outline"
        >
          Import Account
        </Button>
        <Button
          variant="primary"
        >
          Create New Account
        </Button>
      </Group>
    </Modal>
  );
}