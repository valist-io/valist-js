import React from 'react';
import { Textarea as MantineTextarea } from '@mantine/core';
import useStyles from './Textarea.styles'

export interface TextareaProps {
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  rightSection?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export function Textarea(props: TextareaProps) {
  const { classes } = useStyles()
  return (
    <MantineTextarea 
      {...props}
      classNames={classes}
    />
  );
}
