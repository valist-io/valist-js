import { 
  Popover,
  Stack,
  Title,
  Text,
  Group,
  Anchor,
  ScrollArea,
  UnstyledButton,
} from '@mantine/core';

import React, { useState } from 'react';
import * as Icon from 'tabler-icons-react';
import styles from './AccountSelect.module.css';
import { Item } from '../Item';
import { Divider } from '../Divider';
import { Option } from './Option/Option';

export interface AccountSelectProps {
  name: string;
  value: string;
  image?: string;
  href: string;
  onChange: (name: string) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const AccountSelectContext = React.createContext({
  value: '',
  setValue: (value: string) => (void 0),
});

export interface AccountSelectComponent extends React.FC<AccountSelectProps> {
  Option: typeof Option;
}

export const AccountSelect: AccountSelectComponent = (props: AccountSelectProps) => {
  const [opened, setOpened] = useState(false);

  const setValue = (value: string) => {
    setOpened(false);
    props.onChange(value);
  };

  return (
    <Popover    
      width={324}
      radius={0}
      shadow="md"
      position="bottom-start"
      opened={opened}
      onClose={() => setOpened(false)}
      classNames={{ dropdown: styles.popoverBody }}
    >
      <Popover.Target>
        <UnstyledButton 
          style={props.style}
          onClick={() => setOpened(!opened)}
        >
          <Group spacing={10}>
            <Item 
              name={props.name} 
              image={props.image} 
            />
            <Icon.CaretDown 
              size={16} 
              fill="currentColor" 
            />
          </Group>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack spacing={0}>
          <div className={styles.popoverHeader}>
            <Title order={5}>My Accounts</Title>
          </div>
          <ScrollArea.Autosize maxHeight={266}>
            <Stack className={styles.popoverList}>
              <AccountSelectContext.Provider value={{ value: props.value, setValue }}>
                {props.children}
              </AccountSelectContext.Provider>
            </Stack>
          </ScrollArea.Autosize>
          <div className={styles.popoverFooter}>
            <Divider style={{ marginBottom: 16 }} />
            <Anchor href={props.href}>
              <Group spacing={10}>
                <Icon.CirclePlus 
                  size={26}
                  fill="#5850EC" 
                  className={styles.popoverFooterIcon} 
                />
                <Text color="#5850EC">New Account</Text>
              </Group>
            </Anchor>
          </div>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

AccountSelect.Option = Option;