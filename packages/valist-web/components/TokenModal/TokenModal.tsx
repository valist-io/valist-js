import { tokens } from '@/utils/tokens';

import {
  Group,
  ScrollArea,
  Switch,
  Stack,
  Title,
  Text,
} from '@mantine/core';

import { 
  Modal,
  List,
  Account,
  Button,
} from '@valist/ui';

export interface TokenModalProps {
  opened: boolean;
  onClose: () => void;
  values: string[];
  onChange: (values: string[]) => void;
}

export function TokenModal(props: TokenModalProps) {
  const checked = (address: string) => !!props.values.find(
    val => val.toLowerCase() === address.toLowerCase(),
  );

  const remove = (address: string) => props.values.filter(
    val => val.toLowerCase() !== address.toLowerCase(),
  );

  const onChange = (checked: boolean, address: string) => checked
    ? props.onChange([...props.values, address])
    : props.onChange(remove(address));

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      image="/images/tokens.png"
    >
      <Stack>
        <Title>Pricing Token</Title>
        <Text>Add support for purchasing a Software License in additional currencies.</Text>
        <ScrollArea.Autosize maxHeight={350}>
          <List>
            {tokens.map((token: any, index: number) => 
              <Group key={index} position="apart" pr={20}>
                <Account 
                  name={token.symbol}
                  label={token.name}
                  image={token.logoURI} 
                />
                <Switch 
                  checked={checked(token.address)}
                  onChange={(event) => onChange(event.currentTarget.checked, token.address) }
                />
              </Group>,
            )}
          </List>
        </ScrollArea.Autosize>
        <div>
          <Button onClick={props.onClose}>
            Done
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}