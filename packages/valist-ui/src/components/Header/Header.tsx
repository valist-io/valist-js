import {
  ActionIcon,
  Burger,
  Drawer,
  Group,
  TextInput,
  MediaQuery,
  Header as MantineHeader,
} from '@mantine/core';

import React, { useState } from 'react';
import * as Icon from 'tabler-icons-react';
import useStyles from './Header.styles';
import { Logo } from '../Logo';

export interface HeaderProps {
  children?: React.ReactNode;
  opened: boolean;
  onClick(): void;
}

export function Header(props: HeaderProps) {
  const { classes } = useStyles();
  const [searchOpened, setSearchOpened] = useState(false);

  return (
    <MantineHeader height={72} className={classes.root}>
      <Group style={{ height: '100%' }} spacing={0} noWrap>
        <a href="/" style={{ width: 250, flexShrink: 0 }}>
          <Logo />
        </a>
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Group style={{ width: '100%' }}>
            <TextInput
              style={{ flex: '1 1 0px', maxWidth: 350 }}
              placeholder="Search projects"
              icon={<Icon.Search size={18} strokeWidth={3} />}
            />
            <Group 
              style={{ flex: '1 1 0px' }} 
              position="right" 
              ml={20} 
              noWrap
            >
              {props.children}
            </Group>
          </Group>
        </MediaQuery>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Group style={{ flexGrow: 1 }} position="right" noWrap>
            <Drawer
              size="100%"
              position="right"
              padding={24}
              opened={searchOpened}
              withCloseButton={false}
              onClose={() => setSearchOpened(false)}
            >
              <Group noWrap>
                <ActionIcon
                  title="Close"
                  variant="transparent"
                  onClick={() => setSearchOpened(false)}
                >
                  <Icon.ArrowLeft size={24} />
                </ActionIcon>
                <TextInput
                  style={{ flexGrow: 1 }}
                  placeholder="Search"
                  icon={<Icon.Search size={18} strokeWidth={3} />}
                />
              </Group>
            </Drawer>
            <ActionIcon
              title="Search"
              variant="transparent"
              onClick={() => setSearchOpened(true)}
            >
              <Icon.Search size={18} strokeWidth={3} />
            </ActionIcon>
            <Burger
              size="sm"
              opened={props.opened}
              onClick={props.onClick}
            />
          </Group>
        </MediaQuery>
      </Group>
    </MantineHeader>
  );
}

Header.defaultProps = {
  opened: false,
};