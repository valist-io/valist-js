import { 
  Avatar, 
  Center,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';

import React from 'react';
import { useClipboard } from '@mantine/hooks';
import makeBlockie from 'ethereum-blockies-base64';
import useStyles from './Identicon.styles';

export interface IdenticonProps {
  value: string;
  size?: number;
  stack?: boolean;
}

export function Identicon(props: IdenticonProps) {
  const src = makeBlockie(props.value);
  const { classes } = useStyles();
  const clipboard = useClipboard();

  const trunc = `${props.value.slice(0, 6)}..${props.value.slice(-4)}`;
  const label = (
    <Center>
      {clipboard.copied ? 'copied' : trunc }
    </Center>
  );

  return (
    <Tooltip 
      position="bottom"
      placement="center"
      label={label}
      style={{ marginLeft: props.stack ? -16 : 0 }}
      width={110}
      withArrow
    >
      <UnstyledButton 
        onClick={() => clipboard.copy(props.value)}
      >
        <Avatar 
          size={props.size} 
          src={src} 
          classNames={classes}
        />
      </UnstyledButton>
    </Tooltip>
  );
}

Identicon.defaultProps = {
  size: 48,
};