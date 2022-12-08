import { 
  Group, 
  Stack,
  Radio,
  UnstyledButton,
} from '@mantine/core';

import React from 'react';
import useStyles from './RadioCard.styles';

export interface RadioCardProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  rightLabel?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function RadioCard(props: RadioCardProps) {
  const { classes } = useStyles({ checked: props.checked });
  return (
    <UnstyledButton 
      disabled={props.disabled} 
      onClick={props.onChange} 
      className={classes.wrapper}
    >
      <Stack>
        <Group noWrap>
          <Radio value="" color="purple.3" checked={props.checked} readOnly />
          <Group style={{ flexGrow: 1 }} position="apart" noWrap>
            {props.label}
            {props.rightLabel}
          </Group>
        </Group>
        {props.checked && props.children}
      </Stack>
    </UnstyledButton>
  );
}