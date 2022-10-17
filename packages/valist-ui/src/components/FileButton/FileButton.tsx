import {FileButton as FButton } from '@mantine/core';
import { Button } from '../Button';

interface FileButtonProps {
  multiple?: boolean;
  setFiles: (value:any) => void;
}

export function FileButton(props: FileButtonProps):JSX.Element {
  return (
    <FButton onChange={props.setFiles} multiple={props.multiple || false}>
      {(props) => <Button {...props}>Choose File</Button>}
    </FButton>
  );
}