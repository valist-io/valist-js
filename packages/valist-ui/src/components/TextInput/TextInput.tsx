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
  error?: string;
  disabled?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function TextInput(props: TextInputProps) {
  const { classes } = useStyles()
  return (
    <MantineTextInput 
      classNames={classes}
      label={props.label}
      type={props.type}
      icon={props.icon}
      description={props.description}
      placeholder={props.placeholder}
      rightSection={props.rightSection}
      error={props.error}
      disabled={props.disabled}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

TextInput.defaultProps = {

}