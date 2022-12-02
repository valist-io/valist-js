import { TextInput } from "@mantine/core";
import { defaultProps } from "@mantine/dropzone/lib/Dropzone";
import { CopyButton } from "../CopyButton";
import useStyles from "./CopyInput.styles";

interface CopyInputProps {
  value: string;
  label?: string;
}

export function CopyInput(props:CopyInputProps): JSX.Element {
  const { classes } = useStyles();

  return (
    <TextInput
      name={props.label}
      label={props.label}
      rightSection={<CopyButton value={props.value} />}
      value={props.value}
      classNames={classes}
      disabled
    />
  );
};