import { 
  Group,
  Text,
  UnstyledButton,
  Popover,
  Stack,
} from '@mantine/core';

import { useState } from 'react';
import * as Icon from 'tabler-icons-react';
import { Network } from '../Network';
import useStyles from './NetworkSelect.styles';

export interface NetworkSelectProps {
  value: number;
  onChange?: (network: number) => void;
  networks: number[];
}

export function NetworkSelect(props: NetworkSelectProps) {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <Popover    
      width={200}
      radius={0}
      shadow="md"
      position="bottom-start"
      opened={opened}
      onClose={() => setOpened(false)}
      classNames={{ dropdown: classes.dropdown }}
    >
      <Popover.Target>
        <UnstyledButton 
          className={classes.button} 
          onClick={() => setOpened(!opened)}
        >
          <Group align="center" position="apart" noWrap>
            <Network chainId={props.value} />
            <Icon.CaretDown fill="currentColor" size={12} />
          </Group>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          {props.networks.map((network) => 
            <UnstyledButton
              key={network}
              onClick={() => props.onChange?.(network)}
            >
              <Group position="apart">
                <Network chainId={network} />
                {network === props.value && 
                  <Icon.Check color="#669F2A" /> 
                }
              </Group>
            </UnstyledButton>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

NetworkSelect.defaultProps = {
  networks: [137, 80001],
};