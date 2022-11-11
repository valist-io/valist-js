import {
  Group,
  Modal,
  Stack,
  Textarea,
  Title,
} from '@mantine/core';

import { Button } from '../../Button';

export interface SigningModalProps {
  request?: any;
  loading: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function SigningModal(props: SigningModalProps) {
  return (
    <Modal
      radius={16}
      centered={true}
      zIndex={2147483649}
      opened={props.request}
      onClose={props.onReject}
      withCloseButton={false}
    >
      <Stack spacing={16}>
        <Title order={2}>
          {props.request?.type}
        </Title>
        <Textarea 
          minRows={4} 
          maxRows={4} 
          disabled
        >
          {props.request?.data}
        </Textarea>
        <Group grow>
          <Button
            disabled={props.loading}
            onClick={props.onReject}
            variant="outline"
          >
            Reject
          </Button>
          <Button
            disabled={props.loading}
            onClick={props.onApprove}
            variant="primary"
          >
            Approve
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}