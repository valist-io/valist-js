import { 
  Text,
  Avatar,
  NumberInput,
} from '@mantine/core';

import React from 'react';

export interface TokenInputProps {
  value: number;
  decimals: number;
  icon?: string;
  onChange?: (value: number) => void;
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function TokenInput(props: TokenInputProps) {
  const { decimals, icon, ...rest } = props;

  return (
    <NumberInput
      {...rest}
      min={0}
      precision={decimals}
      hideControls
      rightSection={<Avatar src={icon} size={24} />}
    />
  );
}