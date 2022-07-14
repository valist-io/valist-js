import { 
  Popover,
  Stack,
  Title,
  Text,
  Group,
  Anchor,
} from '@mantine/core';

import React, { useState } from 'react';
import * as Icon from 'tabler-icons-react';
import useStyles from './AccountSelect.styles'
import { Account, AccountProps } from '../Account';
import { Divider } from '../Divider';
import { Option } from './Option/Option';
import { Button } from './Button/Button';

export interface AccountSelectProps {
  value: string;
  image?: string;
  href?: string;
  onChange: (name: string) => void;
  children: React.ReactNode;
}

export const AccountSelectContext = React.createContext({
  value: '',
  setValue: (value: string) => (void 0),
});

export interface AccountSelectComponent extends React.FC<AccountSelectProps> {
  Option: typeof Option;
}

export const AccountSelect: AccountSelectComponent = (props: AccountSelectProps) => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  const setValue = (value: string) => {
    setOpened(false);
    props.onChange(value);
  };

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <Button 
          name={props.value} 
          image={props.image} 
          onClick={() => setOpened(!opened)} 
        />
      }
      width={324}
      position="bottom"
      placement="start"
      classNames={{
        body: classes.popoverBody,
        inner: classes.popoverInner,
      }}
    >
      <Stack spacing={0}>
        <div className={classes.popoverHeader}>
          <Title order={5}>My Accounts</Title>
        </div>
        <Stack className={classes.popoverList}>
          <AccountSelectContext.Provider value={{ value: props.value, setValue }}>
            {props.children}
          </AccountSelectContext.Provider>
        </Stack>
        <div className={classes.popoverFooter}>
          <Divider style={{ marginBottom: 16 }} />
          <Anchor href={props.href}>
            <Group spacing={10}>
              <Icon.CirclePlus size={26} color="#fff" fill="#5850EC" />
              <Text color="#5850EC">New Account</Text>
            </Group>
          </Anchor>
        </div>
      </Stack>
    </Popover>
  );
}

AccountSelect.Option = Option;