import { tokens, Token } from '@/utils/tokens';

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
  Item,
  Button,
} from '@valist/ui';

export interface TokenModalProps {
  opened: boolean;
  onClose: () => void;
  values: Token[];
  onChange: (values: Token[]) => void;
}

export function TokenModal(props: TokenModalProps) {
  const checked = (address: string) => {
    const token = props.values.find(token => token.address === address.toLowerCase());
    return token?.show;
  };

  const onChange = (checked: boolean, address: string) => {
    const values = props.values.map(token =>   
      token.address === address.toLowerCase() ? { ...token, show: checked } : token,
    );
    props.onChange(values);
  };

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
                <Item 
                  name={token.symbol}
                  label={token.name}
                  image={token.logoURI} 
                />
                <Switch
                  color="purple.4"
                  checked={checked(token.address)}
                  onChange={(event) => onChange(event.currentTarget.checked, token.address) }
                />
              </Group>,
            )}
          </List>
        </ScrollArea.Autosize>
        <div style={{ marginTop: 16 }}>
          <Button onClick={props.onClose}>
            Save Changes
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}