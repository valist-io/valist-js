import React from 'react';
import { TextInput as MantineTextInput } from '@mantine/core';
import useStyles from './TextInput.styles'

export type InputType =	"number" | "search" | "text" | "tel" | "url" | "email" | "password"

export interface TextInputProps {
  label?: string;
  type?: InputType;
  icon?: React.ReactNode;
  description?: string;
  placeholder?: string;
  rightSection?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  value?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function TextInput(props: TextInputProps) {
  const { classes } = useStyles()
  return (
    <MantineTextInput
      {...props}
      classNames={classes}
    />
  );
}
